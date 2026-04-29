import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

// 🔥 Configuração do seu projeto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDR3Ho-kZyic52B2mxOvNAY3GqXBqqtZf0",
  authDomain: "studypro-1ba51.firebaseapp.com",
  projectId: "studypro-1ba51",
  storageBucket: "studypro-1ba51.firebasestorage.app",
  messagingSenderId: "297401757331",
  appId: "1:297401757331:web:3f9a2d299c9ab4970da766"
};

// 🚀 Inicializa o Firebase (apenas UMA vez no projeto)
const app = initializeApp(firebaseConfig);

// 🔐 Autenticação
const auth = getAuth(app);

// 🗄️ Banco de dados (Firestore)
const db = getFirestore(app);

// 📤 Exporta para usar em outros arquivos
export { auth, db };