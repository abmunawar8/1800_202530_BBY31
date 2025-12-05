import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";

//--------------------------------------------------------------
// If you have custom global styles, import them as well:
//--------------------------------------------------------------
import "../styles/style.css";

//--------------------------------------------------------------
// Custom global JS code (shared with all pages)can go here.
//--------------------------------------------------------------
import { onAuthReady } from "./authentication.js";

// This is an example function. Replace it with your own logic.
function sayHello() {
  console.log("hello");
}

// Function that controls the functionality of the join today button
// On the main page
function joinTodayButton() {
  () => {
    registerBtn.removeEventListener("click", joinTodayButton);
  };
  onAuthReady((user) => {
    if (user) {
      // If user is signed in → redirect back to main.html.
      location.href = "main.html";
      return;
    } else {
      location.href = "login.html";
    }
  });
}

if (document.body.contains(document.getElementById("register-btn"))) {
  const registerBtn = document.getElementById("register-btn");
  registerBtn.addEventListener("click", joinTodayButton);
}
