import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";

import { auth } from "./firebase";

export const cadastrar = async (email, senha) => {
  return await createUserWithEmailAndPassword(
    auth,
    email,
    senha
  );
};

export const login = async (email, senha) => {
  return await signInWithEmailAndPassword(
    auth,
    email,
    senha
  );
};

export const logout = async () => {
  return await signOut(auth);
};