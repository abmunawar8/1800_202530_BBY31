import { auth, db } from "./firebaseConfig.js";
import { collection, doc, setDoc, updateDoc } from "firebase/firestore";

export function addSkillBtnListeners() {
  let skillBtns = document.getElementsByClassName("skill-btn");
  for (let i = 0; i < skillBtns.length; i++) {
    let currentBtn = skillBtns[i];
    currentBtn.addEventListener("click", () =>{
      let isClicked = document.getElementById(currentBtn.id);
      if (isClicked.dataset.clicked == "false") {
        isClicked.setAttribute("class", "skill-btn clicked");
        isClicked.dataset.clicked = "true";
      } else {
        isClicked.setAttribute("class", "skill-btn");
        isClicked.dataset.clicked = "false";
      }
    })
  }
}

addSkillBtnListeners();

function saveSkillsInfo() {
  const user = auth.currentUser;
  let skillBtns = document.getElementsByClassName("skill-btn");
  for (let i = 0; i < skillBtns.length; i++) {
    let currentBtn = document.getElementById(skillBtns[i].id);
    const userDoc = doc(db, "users", user.uid);
    const userSkills = collection(userDoc, "user-skills");
    if (currentBtn.dataset.clicked == "true") {
      setDoc(doc(userSkills, currentBtn.id), {
      hasSkill: "true"
      });
    } else {
      setDoc(doc(userSkills, currentBtn.id), {
      hasSkill: "false"
      });
    }
  }
  saveLocation(user.uid);
  setTimeout(() => {window.location.assign("../main.html")}, 1500)
}

if (document.getElementById("submit-btn")) {
  document.getElementById("submit-btn").addEventListener("click", saveSkillsInfo);
}

async function saveLocation(uid) {
  const userLocation = document.getElementById('searchInput').value;
  console.log(userLocation);
  //b) update user's document in Firestore
  await updateUserDocument2(uid, userLocation);
}

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
