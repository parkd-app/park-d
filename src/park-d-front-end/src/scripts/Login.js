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

// const firebaseApp = initializeApp(
//     {
//         apiKey: "AIzaSyASQl2l6JG5WTrVMw66ZHFMdlfn8fFOuwo",
//         authDomain: "park-d-dev.firebaseapp.com",
//         databaseURL: "https://park-d-dev-default-rtdb.firebaseio.com",
//         projectId: "park-d-dev",
//         storageBucket: "park-d-dev.appspot.com",
//         messagingSenderId: "881254921401",
//         appId: "1:881254921401:web:53e0bcf60deb0b7433d768",
//         measurementId: "G-587V6BC6ZQ"
//     }
// );

// export const auth = getAuth(firebaseApp);
// connectAuthEmulator(auth, "http://localhost:9099");

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

const monitorAuthState = async () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      userMode = false;
      location.replace("../HomeView.html");
    }
  });
};

monitorAuthState();

const logout = async () => {
  await signOut(auth);
};

// btnLogout.addEventListener("click", logout);
