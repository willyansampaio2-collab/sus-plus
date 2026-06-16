import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import process from "node:process";

import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {
  collection,
  getDocs,
  getFirestore,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

const loadDotEnv = () => {
  const envPath = resolve(process.cwd(), ".env");

  if (!existsSync(envPath)) {
    return;
  }

  const envFile = readFileSync(envPath, "utf8");

  envFile
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#") && line.includes("="))
    .forEach((line) => {
      const [key, ...valueParts] = line.split("=");
      const value = valueParts.join("=").replace(/^['"]|['"]$/g, "");

      if (!process.env[key]) {
        process.env[key] = value;
      }
    });
};

loadDotEnv();

const requiredFirebaseEnv = [
  "VITE_API_KEY",
  "VITE_AUTH_DOMAIN",
  "VITE_PROJECT_ID",
  "VITE_STORAGE_BUCKET",
  "VITE_SENDER_ID",
  "VITE_APP_ID",
];

const missingFirebaseEnv = requiredFirebaseEnv.filter((key) => !process.env[key]);

if (missingFirebaseEnv.length) {
  throw new Error(`Variáveis Firebase ausentes: ${missingFirebaseEnv.join(", ")}`);
}

const migrationEmail = process.env.MIGRATION_EMAIL;
const migrationPassword = process.env.MIGRATION_PASSWORD;

if (!migrationEmail || !migrationPassword) {
  throw new Error("Informe MIGRATION_EMAIL e MIGRATION_PASSWORD para autenticar a migração.");
}

const firebaseConfig = {
  apiKey: process.env.VITE_API_KEY,
  authDomain: process.env.VITE_AUTH_DOMAIN,
  projectId: process.env.VITE_PROJECT_ID,
  storageBucket: process.env.VITE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_SENDER_ID,
  appId: process.env.VITE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const dryRun = process.env.MIGRATION_DRY_RUN !== "false";

const credential = await signInWithEmailAndPassword(auth, migrationEmail, migrationPassword);
const targetUserId = process.env.MIGRATION_USER_ID || credential.user.uid;
const snapshot = await getDocs(collection(db, "consultas"));

let updates = 0;

for (const documentSnapshot of snapshot.docs) {
  const data = documentSnapshot.data();
  const patch = {};

  if (!data.userId) {
    patch.userId = targetUserId;
  }

  if (!data.unidade) {
    patch.unidade = data.unidadeSaude || "";
  }

  ["nomePaciente", "cpf", "telefone", "especialidade", "dataConsulta", "horario", "status"].forEach((field) => {
    if (data[field] === undefined || data[field] === null) {
      patch[field] = field === "status" ? "Agendada" : "";
    }
  });

  if (!data.createdAt) {
    patch.createdAt = serverTimestamp();
  }

  if (Object.keys(patch).length === 0) {
    continue;
  }

  updates += 1;
  console.log(`${dryRun ? "[dry-run]" : "[update]"} ${documentSnapshot.id}`, patch);

  if (!dryRun) {
    await updateDoc(documentSnapshot.ref, {
      ...patch,
      updatedAt: serverTimestamp(),
    });
  }
}

console.log(`${updates} consulta(s) precisam de correção.`);

if (dryRun) {
  console.log("Nenhum documento foi alterado. Use MIGRATION_DRY_RUN=false para aplicar.");
}
