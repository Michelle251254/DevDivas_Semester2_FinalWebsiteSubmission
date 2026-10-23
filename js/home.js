//Import signOut and our auth
import { signOut } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import { auth } from "./firebase-config.js";

//Get the Log Out button
let logoutButton = document.getElementById("logout-button");

//Log the user out
async function handleLogout() {
  signOut(auth)
    .then(function () {
      // forget the saved username
      localStorage.removeItem("replayUsername");

      // Only go back to the login page once Firebase has logged us out
      window.location.href = "pages/logIn.html";
    })
    .catch(function (error) {
      console.log("Logout error: " + error.code);
      alert("Could not log out. Please try again.");
    });
}

//Connect the function to the button
logoutButton.addEventListener("click", handleLogout);