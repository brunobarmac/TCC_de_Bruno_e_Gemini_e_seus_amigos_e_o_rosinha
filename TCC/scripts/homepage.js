import { auth, db } from "./firebaseConfig.js";
import { signOut } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
import { getDoc, doc } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

const otpVerified = localStorage.getItem("otpVerified");

if (!otpVerified) {
  window.location.href = "/html/otp.html";
}

const userId = localStorage.getItem('loggedInUserId');

if (userId) {
  const docRef = doc(db, "users", userId);

  getDoc(docRef).then((docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();

      document.getElementById('loggedUserFName').innerText = data.firstName;
      document.getElementById('loggedUserEmail').innerText = data.email;
      document.getElementById('loggedUserLName').innerText = data.lastName;
    }
  });
}

document.getElementById('logout').addEventListener('click', () => {

  // remove apenas usuário logado
  localStorage.removeItem('loggedInUserId');

  // contador de logout
  let logoutCount = localStorage.getItem("logoutCount") || 0;
  logoutCount++;
  localStorage.setItem("logoutCount", logoutCount);

  // 🔐 após 3 saídas pede OTP novamente
  if (logoutCount >= 3) {
    localStorage.removeItem("otpVerified");
    localStorage.setItem("logoutCount", 0);
  }

  signOut(auth).then(() => {
    window.location.href = "/html/login.html";
  });
});