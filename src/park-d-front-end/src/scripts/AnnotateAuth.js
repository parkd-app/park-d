import { auth } from "./FirebaseConfig.js";
import {
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

export const btnLogout = document.querySelector("#btnLogout");

// const monitorAuthState = async () => {
//   onAuthStateChanged(auth, (user) => {
// //     if (!user) {
// //       location.replace("../index.html");
// //     }
// //   });
// // };

// monitorAuthState();

const logout = async () => {
  await signOut(auth);
  location.replace("../index.html");
};

btnLogout.addEventListener("click", logout);