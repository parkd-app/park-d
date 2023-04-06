import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import {
  getAuth,
  connectAuthEmulator,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

import {
  showLoginError,
  password,
  email,
  lblAuthState,
} from "./LoginConstant.js";
import { auth } from "./FirebaseConfig.js";

sessionStorage.setItem("userMode", true);

// Login function with email and password
const loginEmailPassword = async () => {
  const loginEmail = email.value;
  const loginPassword = password.value;

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      loginEmail,
      loginPassword
    );
    console.log(userCredential.user);
  } catch (error) {
    console.log(error);
    showLoginError(error);
  }
};

// Create an account
const createAccount = async () => {
  const loginEmail = email.value;
  const loginPassword = password.value;

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      loginEmail,
      loginPassword
    );
    console.log(userCredential.user);
  } catch (error) {
    console.log(error);
    showLoginError(error);
  }
};

submit.addEventListener("click", loginEmailPassword);

// Monitor the state of the authentication
const monitorAuthState = async () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      sessionStorage.setItem("userMode", false);
      location.replace("../HomeView.html");
    }
  });
};

monitorAuthState();

// Log out functionality
const logout = async () => {
  await signOut(auth);
};

// btnLogout.addEventListener("click", logout);
