import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// ------------------------------------------------------------------
// 🚨 ATENÇÃO: PASSO FINAL PARA SALVAR NA NUVEM 🚨
// ------------------------------------------------------------------
// Para o site salvar e NÃO PERDER DADOS ao dar F5, você precisa
// pegar suas chaves no site do Firebase e colar abaixo.
//
// 1. Vá em: https://console.firebase.google.com/
// 2. Clique na Engrenagem ⚙️ > Configurações do Projeto.
// 3. Role até o fim da página.
// 4. Copie os códigos e cole dentro das aspas abaixo.
// ------------------------------------------------------------------

const firebaseConfig = {
  // A URL do seu banco eu já configurei baseada no seu print:
  databaseURL: "https://site-andreza-scolari-default-rtdb.firebaseio.com",

  // --- COLE SUAS CHAVES AQUI (Mantenha as aspas!) ---
  
  apiKey: "COLE_SUA_API_KEY_AQUI",
  // Exemplo: "AIzaSyD..."

  authDomain: "site-andreza-scolari.firebaseapp.com",
  
  projectId: "site-andreza-scolari",
  
  storageBucket: "site-andreza-scolari.appspot.com",
  
  messagingSenderId: "COLE_SEU_MESSAGING_ID_AQUI",
  // Exemplo: "456789..."
  
  appId: "COLE_SEU_APP_ID_AQUI"
  // Exemplo: "1:456789:web:..."
};

// ------------------------------------------------------------------

// Verifica se você já colou a chave (se não for o texto padrão)
const hasApiKey = firebaseConfig.apiKey && firebaseConfig.apiKey !== "COLE_SUA_API_KEY_AQUI";

export const USE_FIREBASE = hasApiKey;

let app;
let db: any;

if (USE_FIREBASE) {
  try {
    app = initializeApp(firebaseConfig);
    db = getDatabase(app);
    console.log("🔥 Firebase CONECTADO com sucesso!");
  } catch (error) {
    console.error("Erro ao conectar Firebase. Verifique se copiou as chaves corretamente.", error);
    db = null; 
  }
} else {
    console.warn("⚠️ MODO LOCAL: Cole suas chaves no arquivo services/firebase.ts para ativar a nuvem.");
}

export { db };