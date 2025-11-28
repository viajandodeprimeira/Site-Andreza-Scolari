import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// ------------------------------------------------------------------
// CONFIGURAÇÃO DO FIREBASE (GOOGLE BACKEND)
// ------------------------------------------------------------------
// Para produção (Vercel), usamos Variáveis de Ambiente.
// Crie um arquivo .env na raiz localmente ou configure na Vercel.
// ------------------------------------------------------------------

// Tenta pegar das variáveis de ambiente (Vite/Vercel standard)
const env: any = import.meta.env || {};

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || "SUA_API_KEY_AQUI",
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || "seu-projeto.firebaseapp.com",
  projectId: env.VITE_FIREBASE_PROJECT_ID || "seu-projeto",
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || "seu-projeto.appspot.com",
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef"
};

// Lógica para determinar se o Firebase deve ser ativado
// 1. Se a variável VITE_USE_FIREBASE for 'true'
// 2. OU se a API Key não for o placeholder padrão
export const USE_FIREBASE = env.VITE_USE_FIREBASE === 'true' || firebaseConfig.apiKey !== "SUA_API_KEY_AQUI";

let app;
let db: any;

if (USE_FIREBASE) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log("🔥 Firebase conectado via", env.VITE_FIREBASE_API_KEY ? "Variáveis de Ambiente" : "Configuração Manual");
  } catch (error) {
    console.error("Erro ao conectar Firebase:", error);
    // Fallback para evitar crash total se a config estiver errada
    db = null; 
  }
}

export { db };