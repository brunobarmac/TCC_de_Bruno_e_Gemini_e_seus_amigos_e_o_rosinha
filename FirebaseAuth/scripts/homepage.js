import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
import { getFirestore, getDoc, doc } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

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

const auth=getAuth();
const db=getFirestore();

onAuthStateChanged(auth, (user) => {
  const loggedInUserId=localStorage.getItem('loggedInUserId');
  if(loggedInUserId){
    const docRef = doc(db, "users", loggedInUserId);  
    getDoc(docRef)
    .then((docSnap) => {
      if(docSnap.exists()){
        const userData=docSnap.data();
        document.getElementById('loggedUserFName').innerText = userData.firstName;
        document.getElementById('loggedUserEmail').innerText = userData.email;
        document.getElementById('loggedUserLName').innerText = userData.lastName;
      }
      else{
        console.log("Nenhum documento encontrado que corresponda ao ID.")
      }
    })
    .catch((error) =>{
      console.log("Erro ao obter o documento");
    })
  }
  else{
    console.log("ID de usuário não encontrado no armazenamento local.")
  }
})

const logoutButton=document.getElementById('logout');

logoutButton.addEventListener('click', () =>{
  localStorage.removeItem('loggedInUserId');
  signOut(auth)
  .then(()=>{
    window.location.href = '/index.html';
  })
  .catch((error)=>{
    console.error('Erro ao sair:', error);
  });
});