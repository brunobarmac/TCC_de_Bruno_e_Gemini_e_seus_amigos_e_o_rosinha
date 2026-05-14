import { auth, db } from "./firebaseConfig.js";
import { RecaptchaVerifier, signInWithPhoneNumber, PhoneAuthProvider, linkWithCredential } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
import { doc, updateDoc } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

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

// ✅ VERIFICAR CÓDIGO (AGORA CORRETO)
window.codeverify = async function () {
  const code = document.getElementById('verificationcode').value;

  try {
    const credential = PhoneAuthProvider.credential(
      confirmationResult.verificationId,
      code
    );

    // 🔥 VINCULA AO USUÁRIO ATUAL (NÃO CRIA NOVO)
    if (auth.currentUser){
      await linkWithCredential(auth.currentUser, credential);
    }

    // marca no banco
    const uid = auth.currentUser.uid;

    await updateDoc(doc(db, "users", uid), {
      phoneVerified: true
    });

    localStorage.setItem("otpVerified", "true");
    alert("Verificação concluída!");
    window.location.href = "./configuracoes.html";

  } catch (error) {
    console.error(error);
    if (error.code === "auth/credential-already-in-use") {

      // 🔥 número já vinculado antes
      localStorage.setItem("otpVerified", "true");
      alert("Número já verificado!");
      window.location.href = "./configuracoes.html";

    } else {
      alert("Código inválido!");
    }
  }
};