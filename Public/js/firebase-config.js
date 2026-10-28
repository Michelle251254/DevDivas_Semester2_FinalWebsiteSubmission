//Import the two Firebase functions need//
//First, I created a project in the Firebase console and enabled email and password sign-in. Firebase gave me a config object, which tells my website which Firebase project to connect to.
//In this file, I import initializeApp and getAuth from Firebase. initializeApp connects my site to my Firebase project, and getAuth gives me the authentication service. Then I export auth, so my login file can import and use it. Because these files use import and export, the script tag in the HTML needs type="module". Otherwise the browser gives an error.//



import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDSWas56YNJpfQWAbo3KEMX-O44g_SI7Qo",
  authDomain: "login-form-5be95.firebaseapp.com",
  projectId: "login-form-5be95",
  storageBucket: "login-form-5be95.firebasestorage.app",
  messagingSenderId: "63769082242",
  appId: "1:63769082242:web:8fd9e82d127d5355d3779b"
};

//Start Firebase using config
let app = initializeApp(firebaseConfig);

//Get the Authentication service for our app
let auth = getAuth(app);

// Step 5: Export "auth" so logIn.js can use it
export { auth };