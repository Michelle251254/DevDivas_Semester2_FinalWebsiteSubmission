import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import { auth } from "./firebase-config.js";

/* ====================== *
 *  Toggle Between        *
 *  Sign Up / Login       *
 * ====================== */
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

//================================
//Get the HTML elements we need
//================================
let loginForm = document.getElementById("form-login");
let signupForm = document.getElementById("form-signup");
let loginMessage = document.getElementById("loginMessage");
let signupMessage = document.getElementById("signupMessage");

//================================
//Show a message under a form
//================================
// messageType is "success" (green) or "error" (pink)
function showMessage(messageElement, messageContent, messageType) {
  messageElement.textContent = messageContent;
  messageElement.className = "formMessage " + messageType;
}

//================================
//Turn Firebase's error codes into messages a person understands
//================================
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

//================================
//Create a new account
//================================
async function handleSignUp(userEmail, userPassword) {
  createUserWithEmailAndPassword(auth, userEmail, userPassword)
    .then(function (userCredential) {
      console.log("New account created for: " + userCredential.user.email);

      // Firebase signs a new user in automatically.
      // We sign them out so they have to log in themselves.
      signOut(auth)
        .then(function () {
          //remember name from sign up and fill it on the login form
          let signupName = document.getElementById("username-signup").value;
          document.getElementById("username-login").value = signupName;
          
          signupForm.reset();
          showMessage(signupMessage, "", "");

          // slide across to the Log In form (same as clicking the "Log In" button)
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

//================================
//Log in to an existing account
//================================
async function handleLogin(username, userEmail, userPassword) {
  signInWithEmailAndPassword(auth, userEmail, userPassword)
    .then(function (userCredential) {
      console.log("Logged in as: " + userCredential.user.email);

      // save the username so the home page can welcome the user (brief requirement)
      localStorage.setItem("replayUsername", username);

      // This line ONLY runs if Firebase says the login worked.
      window.location.href = "../index.html";
    })
    .catch(function (error) {
      console.log("Login error: " + error.code);
      let friendlyMessage = getFriendlyErrorMessage(error.code);
      showMessage(loginMessage, friendlyMessage, "error");
    });
}

//================================
//Runs when each form is submitted
//================================
function handleLoginSubmit(event) {
  // Stop the form from refreshing the page
  event.preventDefault();

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

//================================
//Connect the functions to the page
//================================
loginForm.addEventListener("submit", handleLoginSubmit);
signupForm.addEventListener("submit", handleSignupSubmit);