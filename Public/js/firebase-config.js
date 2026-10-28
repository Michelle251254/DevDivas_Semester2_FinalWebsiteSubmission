// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js"; // TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCh6ZjPjBRMFOVeYsj1oTHbiLdKmetSG88",
  authDomain: "replaylogin-b57cc.firebaseapp.com",
  projectId: "replaylogin-b57cc",
  storageBucket: "replaylogin-b57cc.firebasestorage.app",
  messagingSenderId: "256705209176",
  appId: "1:256705209176:web:b9ea1aca4d2228f488fb2d",
};

// Initialize Firebase
let app = initializeApp(firebaseConfig);
let auth = getAuth(app);

export { auth };
