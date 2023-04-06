import { auth } from "./FirebaseConfig.js";
import {
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

export const btnLogout = document.querySelector("#btnLogout");

// Logout functionality
const logout = async () => {
  await signOut(auth);
  location.replace("../index.html");
};

btnLogout.addEventListener("click", logout);
