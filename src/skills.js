// src/skills.js
// Display and manage current user's skills on skills.html

import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, doc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "/src/firebaseConfig.js";

// All possible skills (ID must match Firestore document IDs)
const ALL_SKILLS = [
  { id: "hasCommunication", label: "Communication" },
  { id: "hasComputerSkills", label: "Computer Skills" },
  { id: "hasCookingSkills", label: "Cooking Skills" },
  { id: "hasCprCertification", label: "CPR Certification" },
  { id: "hasCriminalRecordCheck", label: "Criminal Record Check" },
  { id: "hasCustomerService", label: "Customer Service" },
  { id: "hasLift50Lbs", label: "Lift 50 Lbs" },
  { id: "hasMentoring", label: "Mentoring" },
  { id: "hasOrganized", label: "Organized" },
  { id: "hasPhysicalFitness", label: "Physical Fitness" },
  { id: "hasPublicInteration", label: "Public Interaction" },
  { id: "hasTeamwork", label: "Teamwork" },
  { id: "hasToolSkills", label: "Tool Skills" },
];

// Helper: read Firestore hasSkill value as true/false
function isSkillTrue(data) {
  const v = data?.hasSkill;
  if (typeof v === "boolean") return v;
  if (typeof v === "string") return v.toLowerCase() === "true";
  return false;
}

// -------------------------------
// Render skills list (show only items where hasSkill is true)
// -------------------------------
async function renderSkillsForUser(user) {
  const listMount = document.getElementById("skills-list");
  const template = document.getElementById("skill-card-tpl");

  if (!listMount || !template) {
    console.error("skills-list or skill-card-tpl not found in DOM.");
    return;
  }

  listMount.innerHTML = "";

  try {
    const skillsColRef = collection(db, "users", user.uid, "user-skills");
    const snap = await getDocs(skillsColRef);

    const activeSkillIds = new Set();

    snap.forEach((docSnap) => {
      const data = docSnap.data();
      const skillId = docSnap.id;

      if (!isSkillTrue(data)) {
        return; // skip skills that are false
      }

      activeSkillIds.add(skillId);

      const skillMeta = ALL_SKILLS.find((s) => s.id === skillId) || {
        id: skillId,
        label: skillId,
      };

      const frag = template.content.cloneNode(true);

      const nameEl = frag.querySelector(".skill-name");
      const detailEl = frag.querySelector(".skill-detail");
      const removeBtn = frag.querySelector(".action-remove-skill");

      if (nameEl) {
        nameEl.textContent = skillMeta.label;
      }
      if (detailEl) {
        detailEl.classList.add("d-none");
      }

      if (removeBtn) {
        removeBtn.dataset.skillId = skillId;
        removeBtn.addEventListener("click", () => handleRemoveSkill(user, skillId));
      }

      listMount.appendChild(frag);
    });

    // Update the dropdown for “Skills You Can Add.”
    renderAvailableSkillsDropdown(activeSkillIds);
  } catch (error) {
    console.error("Failed to load skills:", error);
    listMount.innerHTML = "<p class='text-danger my-3'>Failed to load skills. Please try again later.</p>";
  }
}

// -------------------------------
// Render available skills dropdown
// -------------------------------
function renderAvailableSkillsDropdown(activeSkillIds) {
  const select = document.getElementById("available-skills");
  if (!select) return;

  // Clear old options.
  select.innerHTML = '<option value="">Select a skill</option>';

  // The dropdown should include only items with hasSkill !== true
  ALL_SKILLS.forEach((skill) => {
    if (!activeSkillIds.has(skill.id)) {
      const opt = document.createElement("option");
      opt.value = skill.id;
      opt.textContent = skill.label;
      select.appendChild(opt);
    }
  });

  // Disable it if everything has already been selected
  select.disabled = select.options.length === 1;
}

// -------------------------------
// Add new skill (set hasSkill = true)
// -------------------------------
async function handleAddSkill(user) {
  const select = document.getElementById("available-skills");
  if (!select) return;

  const skillId = select.value;
  if (!skillId) {
    alert("Please select a skill to add.");
    return;
  }

  try {
    alert("Your skills are being updated. This may take a while.");
    const skillDocRef = doc(db, "users", user.uid, "user-skills", skillId);
    // Using setDoc with merge: true allows both creating and updating the document
    await setDoc(
      skillDocRef,
      {
        hasSkill: true,
      },
      { merge: true }
    );

    // Re-render the skills list and the dropdown
    await renderSkillsForUser(user);
  } catch (error) {
    console.error("Failed to add skill:", error);
    alert("Failed to add skill. Please try again.");
  }
}

// -------------------------------
// Remove skill (set hasSkill = false)
// -------------------------------
async function handleRemoveSkill(user, skillId) {
  if (!confirm("Remove this skill from your profile?")) return;

  try {
    const skillDocRef = doc(db, "users", user.uid, "user-skills", skillId);
    await updateDoc(skillDocRef, {
      hasSkill: false,
    });

    await renderSkillsForUser(user);
  } catch (error) {
    console.error("Failed to remove skill:", error);
    alert("Failed to remove skill. Please try again.");
  }
}

// -------------------------------
// Init on page load
// -------------------------------
document.addEventListener("DOMContentLoaded", () => {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      window.location.href = "login.html";
      return;
    }

    // Initially render the skills list.
    renderSkillsForUser(user);

    // Bind the “Add Skill” button.
    const addBtn = document.getElementById("add-skill-btn");
    if (addBtn) {
      addBtn.addEventListener("click", () => handleAddSkill(user));
    }
  });
});
