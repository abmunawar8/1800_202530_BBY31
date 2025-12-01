import { logoutUser } from "./authentication.js";

// Adds an event listener to the logout btn in the account settings
// if clicked, log the user out
document.getElementById("logout-btn").addEventListener("click", logoutUser);
