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

let app = initializeApp(firebaseConfig);

let auth = getAuth(app);

export { auth };