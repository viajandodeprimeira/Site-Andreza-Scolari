import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

// ------------------------------------------------------------------
// CONFIGURAÇÃO DO FIREBASE
// ------------------------------------------------------------------

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

// Lógica simplificada: Se tem apiKey, usa o Firebase.
export const USE_FIREBASE = !!firebaseConfig.apiKey;

let app;
let db: any;
let auth: any;

if (USE_FIREBASE) {
  try {
    app = initializeApp(firebaseConfig);
    db = getDatabase(app);
    auth = getAuth(app);
    console.log("🔥 Firebase (Auth & Database) CONECTADO com sucesso!");
  } catch (error) {
    console.error("Erro ao conectar Firebase.", error);
    db = null; 
    auth = null;
  }
}

export { db, auth };