//==IMPORT FIREBASE FUNCTIONS==
// At the top of logIn.js, I import the three Firebase functions I need: createUserWithEmailAndPassword for signing up, signInWithEmailAndPassword for logging in, and signOut. I also import auth from my config file.//


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

//==TURN FIREBASE ERROR CODES INTO FRIENDLY MESSAGES==
// "Next, I use document.getElementById to store the two forms and the two message areas in variables, so I can use them later.Then I wrote a function called showMessage. It takes three parameters: where to show the message, the text, and the type, which is either success or error. It changes the element's text and its class, and the class makes the message green for success or red for an error.//



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

//==SIGN UP: CREATE A NEW ACCOUNT
// handleSignUp calls Firebase's createUserWithEmailAndPassword with the email and password. Firebase takes a moment to answer, because it's asynchronous, so it returns a promise. I handle the answer with .then() and .catch().If the account is created, .then() runs. I sign the user out straight away so they have to log in themselves, then I reset the form, slide across to the Log In form, and show a green message: 'Account created! Please log in.==//


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

//==LOG IN TO AN EXISTING ACCOUNT
// handleLogin works the same way, but with signInWithEmailAndPassword. If the email and password are correct, .then() runs. I save the username in local storage with localStorage.setItem, so the home page can use it. Then window.location.href takes the user to the home page.The page change is inside .then() on purpose, so the user only gets to the home page once Firebase confirms the password is correct. If the login fails, .catch() shows the error message.//


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