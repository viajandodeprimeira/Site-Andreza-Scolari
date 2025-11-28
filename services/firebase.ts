import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// ------------------------------------------------------------------
// CONFIGURAÇÃO DO FIREBASE (REALTIME DATABASE)
// ------------------------------------------------------------------
// PARA ATIVAR:
// 1. Vá no Console do Firebase > Configurações do Projeto.
// 2. Copie as chaves do SDK ("const firebaseConfig = ...").
// 3. Cole os valores abaixo no lugar dos textos "COLE_SUA_...".
// 4. Salve este arquivo.
// ------------------------------------------------------------------

const env: any = (import.meta as any).env || {};

const firebaseConfig = {
  // --- COLE SUAS CHAVES AQUI ---
  apiKey: env.VITE_FIREBASE_API_KEY || "COLE_SUA_API_KEY_AQUI",
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || "site-andreza-scolari.firebaseapp.com",
  projectId: env.VITE_FIREBASE_PROJECT_ID || "site-andreza-scolari",
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || "site-andreza-scolari.appspot.com",
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || "COLE_SEU_MESSAGING_ID",
  appId: env.VITE_FIREBASE_APP_ID || "COLE_SEU_APP_ID",
  
  // URL do seu banco (Já preenchi com base no seu print)
  databaseURL: "https://site-andreza-scolari-default-rtdb.firebaseio.com"
};

// Verifica se a chave foi configurada (se não for o texto padrão)
const isValidKey = (key: string) => key && key !== "COLE_SUA_API_KEY_AQUI" && key !== "SUA_API_KEY_AQUI";

// Ativa o Firebase apenas se a chave for válida
export const USE_FIREBASE = isValidKey(firebaseConfig.apiKey);

let app;
let db: any;

if (USE_FIREBASE) {
  try {
    app = initializeApp(firebaseConfig);
    db = getDatabase(app);
    console.log("🔥 Firebase conectado! URL:", firebaseConfig.databaseURL);
  } catch (error) {
    console.error("Erro fatal ao conectar Firebase. Verifique suas chaves.", error);
    db = null; 
  }
} else {
    console.log("⚠️ MODO LOCAL ATIVO: Chaves do Firebase não configuradas em services/firebase.ts");
}

export { db };