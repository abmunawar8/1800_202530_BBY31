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
  setTimeout(() => {window.location.assign("../main.html")}, 1500)
}
document.getElementById("submit-btn").addEventListener("click", saveSkillsInfo);
