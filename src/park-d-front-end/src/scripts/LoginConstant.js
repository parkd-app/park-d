import { AuthErrorCodes } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

export const email = document.querySelector("#email");
export const password = document.querySelector("#password");

export const submit = document.querySelector("#submit");

export const divAuthState = document.querySelector("#divAuthState");
export const lblAuthState = document.querySelector("#lblAuthState");

export const divLoginError = document.querySelector("#divLoginError");
export const lblLoginErrorMessage = document.querySelector(
  "#lblLoginErrorMessage"
);

export const hideLoginError = () => {
  divLoginError.style.display = "none";
  lblLoginErrorMessage.innerHTML = "";
};

export const showLoginError = (error) => {
  divLoginError.style.display = "block";
  if (error.code == AuthErrorCodes.INVALID_PASSWORD) {
    lblLoginErrorMessage.innerHTML = `Wrong password. Try again.`;
  } else if (error.code == AuthErrorCodes.INVALID_EMAIL) {
    lblLoginErrorMessage.innerHTML = `Invalid email. Try again.`;
  } else if (error.code == AuthErrorCodes.USER_DELETED) {
    lblLoginErrorMessage.innerHTML = `User does not exist. Try again.`;
  } else if (error.code == AuthErrorCodes.INTERNAL_ERROR) {
    lblLoginErrorMessage.innerHTML = `Internal error. Input a correct username and password and try again.`;
  } else {
    lblLoginErrorMessage.innerHTML = `Error: ${error.message}`;
  }
};

// export const showLoginState = (user) => {
//     lblAuthState.innerHTML = `You're logged in as ${user.displayName} (uid: ${user.uid}, email: ${user.email}) `
// }

hideLoginError();
