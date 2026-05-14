import { auth, db } from "./firebaseConfig.js";

import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

import {
  setDoc,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";


// 🔐 CADASTRO
const signUp = document.getElementById('submitSignUp');

if (signUp) {
  signUp.addEventListener('click', async () => {

    const email = document.getElementById('rEmail').value;
    const password = document.getElementById('rPassword').value;
    const firstName = document.getElementById('fName').value;
    const lastName = document.getElementById('lName').value;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email,
        firstName,
        lastName,
        phoneVerified: false
      });

      alert("Conta criada! Faça login.");

      await signOut(auth);

      window.location.href = "./login.html";

    } catch (error) {
      alert("Erro ao cadastrar");
    }
  });
}


// 🔐 LOGIN
const signIn = document.getElementById('submitSignIn');

if (signIn) {
  signIn.addEventListener('click', async () => {

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      localStorage.setItem('loggedInUserId', user.uid);

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      const otpVerified = localStorage.getItem("otpVerified");

      if (
        userSnap.exists() &&
        userSnap.data().phoneVerified &&
        otpVerified
      ) {
        window.location.href = "./configuracoes.html";
      } else {
        window.location.href = "./otp.html";
      }

    } catch (error) {
      alert("Email ou senha incorretos!");
    }
  });
}