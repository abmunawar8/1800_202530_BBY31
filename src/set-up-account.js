import { auth, db } from "./firebaseConfig.js";
import { collection, doc, setDoc, updateDoc } from "firebase/firestore";
// Import the same city list used in location-autocomplete.js
import { preDefinedSuggestions } from "./location-autocomplete.js";

// ---------------------------------------------
// This function adds clicking events to skill buttons.
// When user clicks, the button changes style.
// Also the data-clicked value changes between true/false.
// ---------------------------------------------

// export function addSkillBtnListeners() {
function addSkillBtnListeners() {
  let skillBtns = document.getElementsByClassName("skill-btn");
  for (let i = 0; i < skillBtns.length; i++) {
    let currentBtn = skillBtns[i];
    currentBtn.addEventListener("click", () => {
      // Get the button element again by its id
      let isClicked = document.getElementById(currentBtn.id);

      // If button is NOT selected
      if (isClicked.dataset.clicked == "false") {
        // Add "clicked" style and mark it as selected
        isClicked.setAttribute("class", "skill-btn clicked");
        isClicked.dataset.clicked = "true";
      } else {
        // If button is already selected, remove the style
        isClicked.setAttribute("class", "skill-btn");
        isClicked.dataset.clicked = "false";
      }
    });
  }
}

addSkillBtnListeners();
console.log("function ran");

// --------------------------------------------------------
// Helper: check if user location is a full valid city
// It returns the clean city name if valid (e.g. "North Vancouver")
// or null if not valid.
// --------------------------------------------------------
function getValidLocationOrNull(rawValue) {
  const trimmed = rawValue.trim();
  if (trimmed === "") {
    return null; //  empty is NOT allowed, treat as invalid
  }

  const lower = trimmed.toLowerCase();

  // Look for exact match in our city list (case-insensitive)
  for (let i = 0; i < preDefinedSuggestions.length; i++) {
    const city = preDefinedSuggestions[i];
    if (city.toLowerCase() === lower) {
      return city; // return the “correct” city name
    }
  }

  // No exact match found → likely something like "north" or a wrong city
  return null;
}

// --------------------------------------------------------
// This function saves user's skills and location.
// It runs when the user clicks the "Submit" button.
// --------------------------------------------------------
async function saveSkillsInfo() {
  const user = auth.currentUser;
  let skillBtns = document.getElementsByClassName("skill-btn");

  //Check if at least 1 skill is selected

  let hasAtLeastOne = false;

  for (let i = 0; i < skillBtns.length; i++) {
    if (skillBtns[i].dataset.clicked === "true") {
      hasAtLeastOne = true;
      break;
    }
  }

  if (!hasAtLeastOne) {
    alert("Please select at least ONE skill before submitting.");
    return;
  }

  //Save skills

  for (let i = 0; i < skillBtns.length; i++) {
    let currentBtn = document.getElementById(skillBtns[i].id);
    const userDoc = doc(db, "users", user.uid);
    const userSkills = collection(userDoc, "user-skills");

    if (currentBtn.dataset.clicked == "true") {
      await setDoc(doc(userSkills, currentBtn.id), { hasSkill: "true" });
    } else {
      await setDoc(doc(userSkills, currentBtn.id), { hasSkill: "false" });
    }
  }

  // C. Save location (with validation)
  const ok = await saveLocation(user.uid);
  if (!ok) {
    // If location is not valid, do not redirect
    return;
  }

  // After saving, go to the main page
  setTimeout(() => {
    window.location.assign("../main.html");
  }, 1500);
}

// Prevent form autofill submission
if (document.getElementById("submit-btn")) {
  document.getElementById("submit-btn").addEventListener("click", (e) => {
    e.preventDefault(); // stop form reload
    saveSkillsInfo();
  });
}

// --------------------------------------------------------
// This function gets the user's location input,
// checks if it is a valid city,
// and sends it to another function that updates Firestore.
// It returns true if save is OK, false if invalid.
// --------------------------------------------------------
async function saveLocation(uid) {
  const input = document.getElementById("searchInput");
  if (!input) {
    console.error("searchInput not found");
    return false;
  }

  const raw = input.value;
  console.log("User typed location:", raw);

  const validLocation = getValidLocationOrNull(raw);

  // If user typed something but it is not a full valid city
  if (validLocation === null) {
    alert("Please type or select a full city name (for example, 'North Vancouver') instead of only a partial word.");
    return false;
  }

  // If empty string "" is allowed, we also save it (you can change this rule later)
  await updateUserDocument2(uid, validLocation);
  console.log("Saved location:", validLocation);
  return true;
}

// --------------------------------------------------------
// This function updates the main user document in Firestore.
// It sets the "location" field to the new value.
// --------------------------------------------------------

async function updateUserDocument2(uid, location) {
  try {
    console.log(location);
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, { location });
    console.log("User document successfully updated!");
  } catch (error) {
    console.error("Error updating user document:", error);
  }
}
