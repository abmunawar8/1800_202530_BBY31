import { collection, doc, getDocs } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebaseConfig.js";

// Get the document ID from the URL
function getDocIdFromUrl() {
  const params = new URL(window.location.href).searchParams;
  return params.get("docID");
}

document.addEventListener("DOMContentLoaded", () => {
  const filterButton = document.getElementById("filterButton");

  filterButton.addEventListener("click", () => {
    // 1. Check if at least ONE filter option is selected
    const allInputs = document.querySelectorAll("input[type='checkbox'], input[type='radio']");

    const anySelected = Array.from(allInputs).some((input) => input.checked);

    // 2. Check if they opened the skills filter dropdown
    if (!anySelected) {
      alert("Please select at least one filter option.");
      return;
    }

    // 3. Build TRUE/FALSE list for skills checkboxes
    const skillInputs = document.querySelectorAll("input[name='skills[]']");
    const skillBooleanList = Array.from(skillInputs).map((checkbox) => checkbox.checked);

    // 4. Get the selected date_sort radio value
    const dateRadio = document.querySelector("input[name='date_sort[]']:checked");

    // 5. Check if they selected any filters at all
    if (skillBooleanList.includes(true)) {
      localStorage.setItem("skillsList", JSON.stringify(skillBooleanList));
      window.location.href = "main.html";
    } else {
      alert("Please select at least one filter option.");
    }
  });
});
