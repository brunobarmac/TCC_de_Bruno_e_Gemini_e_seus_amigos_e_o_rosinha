import { auth, db } from "./firebaseConfig.js";

import {
  RecaptchaVerifier,
  signInWithPhoneNumber
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

import {
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";


let confirmationResult;

// 🔐 reCAPTCHA
window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
  size: 'normal'
});

// 📩 ENVIAR OTP
window.phoneAuth = async function () {
  const number = document.getElementById('number').value;

  try {
    confirmationResult = await signInWithPhoneNumber(auth, number, window.recaptchaVerifier);

    document.getElementById('sender').style.display = 'none';
    document.getElementById('verifier').style.display = 'block';

  } catch (error) {
    alert(error.message);
  }
};

// ✅ VERIFICAR CÓDIGO
window.codeverify = async function () {
  const code = document.getElementById('verificationcode').value;

  try {
    await confirmationResult.confirm(code);

    const uid = localStorage.getItem("loggedInUserId");

    await updateDoc(doc(db, "users", uid), {
      phoneVerified: true
    });

    localStorage.setItem("otpVerified", "true");

    alert("Verificado!");

    window.location.href = "/pages/homepage.html";

  } catch {
    alert("Código inválido!");
  }
};