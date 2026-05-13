<<<<<<< HEAD
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDR3Ho-kZyic52B2mxOvNAY3GqXBqqtZf0",
  authDomain: "studypro-1ba51.firebaseapp.com",
  projectId: "studypro-1ba51",
  storageBucket: "studypro-1ba51.firebasestorage.app",
  messagingSenderId: "297401757331",
  appId: "1:297401757331:web:3f9a2d299c9ab4970da766"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

function showMessage(message, divId) {
  var messageDiv = document.getElementById(divId);
  messageDiv.style.display = "block";
  messageDiv.innerHTML = message;
  messageDiv.style.opacity = 1;
  setTimeout(function (){
    messageDiv.style.opacity = 0;
  }, 5000);
}
const signUp = document.getElementById('submitSignUp');
signUp.addEventListener('click', (event) => {
  event.preventDefault();
  const email = document.getElementById('rEmail').value;
  const password = document.getElementById('rPassword').value;
  const firstName = document.getElementById('fName').value;
  const lastName = document.getElementById('lName').value;

  const auth = getAuth();
  const db = getFirestore();

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      const userData = {
        email: email,
        firstName: firstName,
        lastName: lastName
      };
      showMessage('Conta criada com sucesso', 'signUpMessage');
      const docRef = doc(db, "users", user.uid);
      setDoc(docRef, userData)
        .then(() => {
          window.location.href = "index.html";
        })
        .catch((error) => {
          console.error("Erro ao salvar dados do usuário:", error);
        });
    })
    .catch((error) => {
      const errorCode = error.code;
      if (errorCode == 'auth/email-already-in-use') {
        showMessage('Endereço de e-mail já existente!', 'signUpMessage');
      }
      else {
        showMessage('Erro ao criar conta!', 'signUpMessage');
      }
    })
})

const signIn = document.getElementById('submitSignIn');
signIn.addEventListener('click', (event) => {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const auth = getAuth();

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      showMessage('Login realizado com sucesso', 'signInMessage');
      const user = userCredential.user;
      localStorage.setItem('loggedInUserId', user.uid);
      window.location.href = '/pages/homepage.html'; // Assuming a dashboard page
    })
    .catch((error) => {
      const errorCode = error.code;
      if (errorCode === 'auth/invalid-credential') {
        showMessage('Email ou senha incorretos!', 'signInMessage');
      }
      else {
        showMessage('Erro ao fazer login!', 'signInMessage');
      }
    })
});
=======
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

      window.location.href = "/index.html";

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
        window.location.href = "/pages/homepage.html";
      } else {
        window.location.href = "/pages/otp.html";
      }

    } catch (error) {
      alert("Email ou senha incorretos!");
    }
  });
}
>>>>>>> branch-do-luiz
