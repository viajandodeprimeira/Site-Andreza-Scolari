import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

// ------------------------------------------------------------------
// CONFIGURAÇÃO DO FIREBASE
// ------------------------------------------------------------------
// Dados transcritos da imagem enviada pelo usuário.
// A apiKey abaixo serve tanto para o Database quanto para o Authentication.

const firebaseConfig = {
  apiKey: "AIzaSyAgTqVqwYWRQWtrX8jpOSypkYOo31vtWYw",
  authDomain: "site-andreza-scolari.firebaseapp.com",
  projectId: "site-andreza-scolari",
  storageBucket: "site-andreza-scolari.firebasestorage.app",
  messagingSenderId: "1086298604090",
  appId: "1:1086298604090:web:d1cb20348866819fa12b03",
  databaseURL: "https://site-andreza-scolari-default-rtdb.firebaseio.com"
};

// ------------------------------------------------------------------

// Validação simples
export const USE_FIREBASE = 
  !!firebaseConfig.apiKey && 
  firebaseConfig.apiKey !== "AIzaSyAgTqVqwYWRQWtrX8jpOSypkYOo31vtWYw" &&
  firebaseConfig.apiKey.length > 10;

let app;
let db: any;
let auth: any;

if (USE_FIREBASE) {
  try {
    app = initializeApp(firebaseConfig);
    db = getDatabase(app);
    auth = getAuth(app);
    console.log("🔥 Firebase conectado com sucesso!");
  } catch (error) {
    console.error("Erro na conexão Firebase:", error);
    db = null;
    auth = null;
  }
} else {
  console.warn("⚠️ Firebase não configurado corretamente. Rodando em Modo Local.");
}

export { db, auth };
