import { auth, db } from "./firebaseConfig.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
import { getDoc, doc } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

// 🔒 BLOQUEIO SEM OTP
const otpVerified = localStorage.getItem("otpVerified");

if (!otpVerified) {
  window.location.href = "/pages/otp.html";
}

// 👤 VER DADOS DO USUÁRIO
onAuthStateChanged(auth, (user) => {
  const loggedInUserId = localStorage.getItem('loggedInUserId');

  if (loggedInUserId) {
    const docRef = doc(db, "users", loggedInUserId);

    getDoc(docRef)
      .then((docSnap) => {
        if (docSnap.exists()) {
          const userData = docSnap.data();

          document.getElementById('loggedUserFName').innerText = userData.firstName;
          document.getElementById('loggedUserEmail').innerText = userData.email;
          document.getElementById('loggedUserLName').innerText = userData.lastName;
        } else {
          console.log("Usuário não encontrado no banco.");
        }
      })
      .catch(() => {
        console.log("Erro ao buscar dados do usuário.");
      });
  } else {
    console.log("Usuário não logado.");
  }
});

// 🚪 LOGOUT
const logoutButton = document.getElementById('logout');

if (logoutButton) {
  logoutButton.addEventListener('click', () => {
    localStorage.removeItem('loggedInUserId');
    localStorage.removeItem('otpVerified');

    signOut(auth)
      .then(() => {
        window.location.href = "/index.html";
      })
      .catch((error) => {
        console.error("Erro ao sair:", error);
      });
  });
}