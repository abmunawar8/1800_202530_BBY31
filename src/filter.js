// import { db } from "./firebaseConfig.js";
// import { doc, getDoc } from "firebase/firestore";
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
    const allInputs = document.querySelectorAll(
      "input[type='checkbox'], input[type='radio']"
    );

    const anySelected = Array.from(allInputs).some((input) => input.checked);

    if (!anySelected) {
      alert("Please select at least one filter option.");
      return;
    }

    // 2. Build TRUE/FALSE list for skills checkboxes
    const skillInputs = document.querySelectorAll("input[name='skills[]']");
    const skillBooleanList = Array.from(skillInputs).map((checkbox) => checkbox.checked);

    console.log("Skill Booleans:", skillBooleanList);
    // Example output: [true, false, false, true, ...]


    // 3. Get the selected date_sort radio value
    const dateRadio = document.querySelector("input[name='date_sort[]']:checked");
    // const dateSortSelection = dateRadio ? dateRadio.value : null;

    // console.log("Date Sort Selection:", dateSortSelection);
    // Example output: "newest" or "oldest" or null


    // ⭐ Example: If you want to save or send them somewhere:
    const filterResults = {
      skills: skillBooleanList,
      // date_sort: dateSortSelection
    };

    // console.log("FINAL FILTER RESULTS:", filterResults);
    console.log("FINAL FILTER RESULTS:", skillBooleanList);

    // You can redirect, send to backend, store in localStorage, etc.
    // window.location.href = "main.html";
  });
});
