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
  // TODO: implement your logic here
}

function checkSignedInFromRegisterButton() {
  location.href = "login.html";
  onAuthReady((user) => {
    if (!user) {
      // If no user is signed in → redirect back to login page.
      location.href = "index.html";
      return;
    } else {
      location.href = "main.html";
    }
  });
}

document.addEventListener("DOMContentLoaded", sayHello);
