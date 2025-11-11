import { auth, db } from "./firebaseConfig.js";
import { collection, doc, setDoc } from "firebase/firestore";

function addSkillBtnListeners() {
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

document.getElementById("submit-btn").addEventListener("click", saveSkillsInfo);
function saveSkillsInfo() {
  const user = auth.currentUser;
  let skillBtns = document.getElementsByClassName("skill-btn");
  for (let i = 0; i < skillBtns.length; i++) {
    let currentBtn = document.getElementById(skillBtns[i].id);
    if (currentBtn.dataset.clicked == "true") {
      localStorage.setItem(currentBtn.id, "true");
      const userDoc = doc(db, "users", user.uid);
      const userSkills = collection(userDoc, "user-skills");
      setDoc(doc(userSkills, currentBtn.id), {
        hasSkill: "true"
      });
    } else {
      localStorage.setItem(currentBtn, "false");
    }
  }
}