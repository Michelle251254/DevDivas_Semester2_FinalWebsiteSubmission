//==IMPORT FIREBASE FUNCTIONS==//
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import { auth } from "./firebase-config.js";

//==TOGGLE BETWEEN SIGN UP AND LOG IN==//
$(document).ready(function () {
  $("#goRight").on("click", function () {
    $("#slideBox").animate({
      marginLeft: "0",
    });
    $(".topLayer").animate({
      marginLeft: "100%",
    });
  });
  $("#goLeft").on("click", function () {
    $("#slideBox").animate({
      marginLeft: "50%",
    });
    $(".topLayer").animate({
      marginLeft: "0",
    });
  });
});

//==GET THE HTML ELEMENTS==//
let loginForm = document.getElementById("form-login");
let signupForm = document.getElementById("form-signup");
let loginMessage = document.getElementById("loginMessage");
let signupMessage = document.getElementById("signupMessage");

//==SHOW A MESSAGE UNDER A FORM ("success" or "error")==//
function showMessage(messageElement, messageContent, messageType) {
  messageElement.textContent = messageContent;
  messageElement.className = "formMessage " + messageType;
}

//==TURN FIREBASE ERROR CODES INTO FRIENDLY MESSAGES==//
function getFriendlyErrorMessage(errorCode) {
  let friendlyMessage = "Something went wrong. Please try again.";

  if (errorCode === "auth/invalid-credential") {
    friendlyMessage = "Incorrect email or password.";
  } else if (errorCode === "auth/email-already-in-use") {
    friendlyMessage = "An account with this email already exists.";
  } else if (errorCode === "auth/weak-password") {
    friendlyMessage = "Password must be at least 6 characters.";
  } else if (errorCode === "auth/invalid-email") {
    friendlyMessage = "Please enter a valid email address.";
  }

  return friendlyMessage;
}

//==SIGN UP: CREATE A NEW ACCOUNT==//
async function handleSignUp(userEmail, userPassword) {
  createUserWithEmailAndPassword(auth, userEmail, userPassword)
    .then(function (userCredential) {
      console.log("New account created for: " + userCredential.user.email);

      // sign the new user out, so they have to log in themselves
      signOut(auth)
        .then(function () {
          signupForm.reset();
          showMessage(signupMessage, "", "");

          // slide across to the Log In form
          $("#goLeft").trigger("click");
          showMessage(loginMessage, "Account created! Please log in.", "success");
        });
    })
    .catch(function (error) {
      console.log("Sign up error: " + error.code);
      let friendlyMessage = getFriendlyErrorMessage(error.code);
      showMessage(signupMessage, friendlyMessage, "error");
    });
}

//==LOG IN TO AN EXISTING ACCOUNT==//
async function handleLogin(username, userEmail, userPassword) {
  signInWithEmailAndPassword(auth, userEmail, userPassword)
    .then(function (userCredential) {
      console.log("Logged in as: " + userCredential.user.email);

      // save the username for the home page welcome message
      localStorage.setItem("replayUsername", username);

      window.location.href = "pages/landingP.html";
    })
    .catch(function (error) {
      console.log("Login error: " + error.code);
      let friendlyMessage = getFriendlyErrorMessage(error.code);
      showMessage(loginMessage, friendlyMessage, "error");
    });
}

//==WHEN EACH FORM IS SUBMITTED==//
function handleLoginSubmit(event) {
  event.preventDefault(); // stops the page from refreshing

  let username = document.getElementById("username-login").value;
  let userEmail = document.getElementById("email-login").value;
  let userPassword = document.getElementById("password-login").value;

  handleLogin(username, userEmail, userPassword);
}

function handleSignupSubmit(event) {
  event.preventDefault();

  let userEmail = document.getElementById("email").value;
  let userPassword = document.getElementById("password-signup").value;

  handleSignUp(userEmail, userPassword);
}

//==CONNECT THE FUNCTIONS TO THE FORMS==//
loginForm.addEventListener("submit", handleLoginSubmit);
signupForm.addEventListener("submit", handleSignupSubmit);