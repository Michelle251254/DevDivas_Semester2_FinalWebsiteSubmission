//Import the two Firebase functions we need//


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

// Step 3: Start Firebase using our config
let app = initializeApp(firebaseConfig);

// Step 4: Get the Authentication service for our app
let auth = getAuth(app);

// Step 5: Export "auth" so logIn.js and home.js can use it
export { auth };