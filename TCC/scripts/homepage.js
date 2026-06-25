import { auth, db } from "./firebaseConfig.js";
import { signOut } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
import { getDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";
import { getLevelData } from "./gamificacao/gamificacao.js";
import { getListaTrofeus } from "./gamificacao/conquistas.js";

const otpVerified = localStorage.getItem("otpVerified");

if (!otpVerified) {
  window.location.href = "../html/otp.html";
}

const userId = localStorage.getItem('loggedInUserId');

if (userId) {
  const docRef = doc(db, "users", userId);

  getDoc(docRef).then((docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();

      const firstNameEl = document.getElementById('loggedUserFName');
      const lastNameEl = document.getElementById('loggedUserLName');
      const emailEl = document.getElementById('loggedUserEmail');

      setElementTextOrValue(firstNameEl, data.firstName);
      setElementTextOrValue(lastNameEl, data.lastName);
      setElementTextOrValue(emailEl, data.email);

      populateConfigInputs(data);

      if (document.getElementById('playerPanel')) {
        atualizarPainelDoJogador(data);
      }
    }
  });
}

function setElementTextOrValue(element, value) {
  if (!element) return;
  if ('value' in element) {
    element.value = value || '';
  } else {
    element.innerText = value || '';
  }
}

function populateConfigInputs(data) {
  const firstNameInput = document.getElementById('loggedUserFName');
  const lastNameInput = document.getElementById('loggedUserLName');
  const playerNameHeading = document.getElementById('playerName');

  if (firstNameInput) {
    firstNameInput.value = data.firstName || '';
  }

  if (lastNameInput) {
    lastNameInput.value = data.lastName || '';
  }

  if (playerNameHeading) {
    const firstName = data.firstName || '';
    const lastName = data.lastName || '';
    playerNameHeading.textContent = [firstName, lastName].filter(Boolean).join(' ') || 'Usuário';
  }
}

async function saveUserProfile() {
  const firstNameInput = document.getElementById('loggedUserFName');
  const lastNameInput = document.getElementById('loggedUserLName');
  const playerNameHeading = document.getElementById('playerName');
  const userId = localStorage.getItem('loggedInUserId');

  if (!firstNameInput || !lastNameInput || !playerNameHeading || !userId) return;

  const firstName = firstNameInput.value.trim();
  const lastName = lastNameInput.value.trim();

  if (!firstName || !lastName) {
    alert('Preencha Nome e Sobrenome antes de salvar.');
    return;
  }

  try {
    await updateDoc(doc(db, 'users', userId), {
      firstName,
      lastName
    });

    playerNameHeading.textContent = `${firstName} ${lastName}`;
    alert('Nome e sobrenome salvos com sucesso!');
  } catch (error) {
    console.error('Erro ao salvar dados do usuário:', error);
    alert('Erro ao salvar alterações. Tente novamente.');
  }
}

const saveChangesButton = document.getElementById('saveChanges');
if (saveChangesButton) {
  saveChangesButton.addEventListener('click', saveUserProfile);
}

function atualizarPainelDoJogador(data) {
  const photo = document.getElementById('player-photo');
  const playerName = document.getElementById('playerName');
  const playerEmail = document.getElementById('playerEmail');
  const playerLevel = document.getElementById('playerLevel');
  const xpCurrent = document.getElementById('xpCurrentVal');
  const xpNext = document.getElementById('xpNextVal');
  const xpNeeded = document.getElementById('xpNeededVal');
  const xpBarFill = document.getElementById('xpBarFill');
  const xpCurrentText = document.getElementById('xpCurrentText');
  const totalTrophies = document.getElementById('totalTrophies');
  const questionsAnswered = document.getElementById('questionsAnswered');
  const questionsCorrect = document.getElementById('questionsCorrect');
  const accuracyRate = document.getElementById('accuracyRate');
  const testsCompleted = document.getElementById('testsCompleted');
  const perfectTests = document.getElementById('perfectTests');

  const firstName = data.firstName || '';
  const lastName = data.lastName || '';
  const email = data.email || '';
  const xp = data.xp || 0;
  const nivel = data.nivel || getLevelData(xp).nivel;
  const estatisticas = data.estatisticas || {};
  const trofeus = data.trofeus || {};
  const { proxNivelXP, xpParaProximo } = getLevelData(xp);

  if (photo) {
    photo.src = data.photoURL || data.avatar || '../imagens/foto-avatar.png';
  }

  if (playerName) {
    playerName.textContent = `${firstName} ${lastName}`.trim() || 'Usuário';
  }

  if (playerEmail) {
    playerEmail.textContent = email;
  }

  if (playerLevel) {
    playerLevel.textContent = nivel;
  }

  if (xpCurrent) {
    xpCurrent.textContent = xp;
  }

  if (xpCurrentText) {
    xpCurrentText.textContent = xp;
  }

  if (xpNext) {
    xpNext.textContent = proxNivelXP;
  }

  if (xpNeeded) {
    xpNeeded.textContent = xpParaProximo;
  }

  if (xpBarFill) {
    const percent = proxNivelXP > 0 ? Math.min(100, Math.round((xp / proxNivelXP) * 100)) : 100;
    xpBarFill.style.width = `${percent}%`;
    xpBarFill.textContent = `${percent}%`;
  }

  if (totalTrophies) {
    totalTrophies.textContent = getListaTrofeus().length;
  }

  if (questionsAnswered) {
    questionsAnswered.textContent = estatisticas.questoesRespondidas || 0;
  }

  if (questionsCorrect) {
    questionsCorrect.textContent = estatisticas.questoesCorretas || 0;
  }

  if (accuracyRate) {
    const responded = estatisticas.questoesRespondidas || 0;
    const correct = estatisticas.questoesCorretas || 0;
    const rate = responded ? Math.round((correct / responded) * 100) : 0;
    accuracyRate.textContent = `${rate}%`;
  }

  if (testsCompleted) {
    testsCompleted.textContent = estatisticas.provasConcluidas || 0;
  }

  if (perfectTests) {
    perfectTests.textContent = estatisticas.provasPerfeitas || 0;
  }
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
    window.location.href = "../html/login.html";
  });
});