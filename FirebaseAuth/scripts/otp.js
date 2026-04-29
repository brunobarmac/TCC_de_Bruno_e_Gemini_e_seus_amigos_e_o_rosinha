import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { 
  getAuth, 
  RecaptchaVerifier, 
  signInWithPhoneNumber 
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "SUA_KEY",
  authDomain: "SEU_DOMINIO",
  projectId: "SEU_ID",
  storageBucket: "SEU_BUCKET",
  messagingSenderId: "SEU_ID",
  appId: "SEU_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// 🔥 RECAPTCHA
window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
  'size': 'normal'
});

// 📲 ENVIAR CÓDIGO
window.phoneAuth = function () {
  const number = document.getElementById('number').value;

  signInWithPhoneNumber(auth, number, window.recaptchaVerifier)
    .then((confirmationResult) => {
      window.confirmationResult = confirmationResult;

      document.getElementById('sender').style.display = 'none';
      document.getElementById('verifier').style.display = 'block';
    })
    .catch((error) => {
      alert(error.message);
    });
};

// ✅ VERIFICAR CÓDIGO
window.codeverify = function () {
  const code = document.getElementById('verificationcode').value;

  window.confirmationResult.confirm(code)
    .then(() => {
      alert("Número verificado com sucesso!");

      // 🔥 AGORA SIM vai pra homepage
      window.location.href = "/pages/homepage.html";
    })
    .catch(() => {
      alert("Código incorreto!");
    });
};