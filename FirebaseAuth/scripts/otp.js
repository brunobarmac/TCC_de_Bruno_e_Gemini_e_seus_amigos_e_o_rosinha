import { auth, db } from "./firebaseConfig.js";
import { RecaptchaVerifier, PhoneAuthProvider, linkWithCredential } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
import { doc, updateDoc } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

let verificationId = null;

// 🔥 RECAPTCHA
window.onload = function () {
  window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
    size: 'normal'
  });
  window.recaptchaVerifier.render();
};

// 📲 ENVIAR CÓDIGO
window.phoneAuth = async function () {
  const number = document.getElementById('number').value;

  const provider = new PhoneAuthProvider(auth);

  verificationId = await provider.verifyPhoneNumber(
    number,
    window.recaptchaVerifier
  );

  alert("Código enviado!");

  document.getElementById('sender').style.display = 'none';
  document.getElementById('verifier').style.display = 'block';
};

// 🔐 VERIFICAR CÓDIGO (AQUI ESTÁ A MÁGICA)
window.codeverify = async function () {
  const code = document.getElementById('verificationcode').value;

  const credential = PhoneAuthProvider.credential(verificationId, code);

  try {
    // 🔥 LINKA O TELEFONE COM O USUÁRIO LOGADO
    await linkWithCredential(auth.currentUser, credential);

    await updateDoc(doc(db, "users", auth.currentUser.uid), {
      phoneVerified: true
    });

    localStorage.setItem("otpVerified", "true");

    alert("Verificação concluída!");

    window.location.href = "/pages/homepage.html";

  } catch (error) {
    console.error(error);
    alert("Código inválido!");
  }
};