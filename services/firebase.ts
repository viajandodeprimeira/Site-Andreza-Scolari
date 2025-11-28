import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// ------------------------------------------------------------------
// 🚨 ATENÇÃO: HORA DE COLAR AS CHAVES 🚨
// ------------------------------------------------------------------
// No passo 2 da tela do Firebase ("Adicionar o SDK"), ele vai mostrar
// um código parecido com este abaixo.
//
// Copie os códigos (letras e números aleatórios) que estão entre aspas
// lá no site e cole aqui no lugar dos textos em MAIÚSCULO.
// ------------------------------------------------------------------

const firebaseConfig = {
  // 1. Cole a apiKey que o Firebase mostrou:
  apiKey: "AIzaSyAgTqVqwYWRQWtrX8jp0SypkYOo31vtWYw",

  // 2. Cole o authDomain:
  authDomain: "site-andreza-scolari.firebaseapp.com",

  // 3. Cole o projectId:
  projectId: "site-andreza-scolari",

  // 4. Cole o storageBucket:
  storageBucket: "site-andreza-scolari.firebasestorage.app",

  // 5. Cole o messagingSenderId:
  messagingSenderId: "1086298604090",

  // 6. Cole o appId:
  appId: "1:1086298604090:web:d1cb20348866819fa12b03",

  // 7. A URL do Banco (Essa eu já preenchi para você):
  databaseURL: "https://site-andreza-scolari-default-rtdb.firebaseio.com"
};

// ------------------------------------------------------------------

// Verifica se você já configurou a chave
const hasApiKey = firebaseConfig.apiKey && firebaseConfig.apiKey !== "AIzaSyAgTqVqwYWRQWtrX8jp0SypkYOo31vtWYw";

export const USE_FIREBASE = hasApiKey;

let app;
let db: any;

if (USE_FIREBASE) {
  try {
    app = initializeApp(firebaseConfig);
    db = getDatabase(app);
    console.log("🔥 Firebase CONECTADO com sucesso!");
  } catch (error) {
    console.error("Erro ao conectar Firebase.", error);
    db = null; 
  }
} else {
    // Se ainda não colou as chaves, avisa no console
    console.warn("Aguardando configuração das chaves no arquivo services/firebase.ts");
}

export { db };
