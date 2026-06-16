import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";

import { auth } from "./firebase";

const authMessages = {
  "auth/email-already-in-use": "Este e-mail já está cadastrado.",
  "auth/invalid-email": "Informe um e-mail válido.",
  "auth/weak-password": "A senha deve ter pelo menos 6 caracteres.",
  "auth/user-not-found": "Usuário não encontrado.",
  "auth/wrong-password": "Senha incorreta.",
  "auth/invalid-credential": "E-mail ou senha incorretos.",
  "auth/missing-password": "Informe a senha.",
};

const validarCampos = (email, senha) => {
  if (!email?.trim() || !senha?.trim()) {
    const erro = new Error("Campos obrigatórios");
    erro.code = "auth/empty-fields";
    throw erro;
  }
};

export const cadastrar = async (email, senha) => {
  validarCampos(email, senha);

  return await createUserWithEmailAndPassword(
    auth,
    email.trim(),
    senha
  );
};

export const login = async (email, senha) => {
  validarCampos(email, senha);

  return await signInWithEmailAndPassword(
    auth,
    email.trim(),
    senha
  );
};

export const logout = async () => {
  return await signOut(auth);
};

export const getAuthErrorMessage = (erro) => {
  if (erro?.code === "auth/empty-fields") {
    return "Preencha e-mail e senha para continuar.";
  }

  return authMessages[erro?.code] || "Não foi possível concluir a autenticação. Tente novamente.";
};
