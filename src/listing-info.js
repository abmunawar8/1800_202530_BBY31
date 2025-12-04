// import { db } from "./firebaseConfig.js";
// import { doc, getDoc } from "firebase/firestore";

import { getId } from "firebase/installations";
import { onAuthReady } from "./authentication.js";
import { db, auth } from "./firebaseConfig.js";
import { doc, onSnapshot, setDoc, getDoc, getDocs, collection } from "firebase/firestore";

let currentVolunteerData = null;

// Get the document ID from the URL
function getDocIdFromUrl() {
  const params = new URL(window.location.href).searchParams;
  return params.get("docID");
}

// Fetch the volunteer oppurtunity and display its name and image
async function displayVolunteerInfo() {
  const id = getDocIdFromUrl();

  try {
    const volunteerRef = doc(db, "listings", id);
    const volunteerSnap = await getDoc(volunteerRef);

    currentVolunteerData = volunteerSnap.data();
    // console.log(currentVolunteerData);
    const volunteer = currentVolunteerData;
    const name = volunteer.name;
    // The detail constants
    const address = volunteer.address;
    const city = volunteer.city;
    const dateAdded = volunteer.dateAdded;
    const description = volunteer.description;
    const frequency = volunteer.frequency;
    const startDate = volunteer.startDate;
    const endDate = volunteer.endDate;
    const skills = volunteer.skills;
    const email = volunteer.contactEmail;
    const phoneNum = volunteer.phoneNum;

    const docName = volunteer.docID;

    const numVolunteerFields = Object.keys(volunteer);
    let skillsString = "";
    for (let i = 0; i < numVolunteerFields.length; i++) {
      if (typeof volunteer[numVolunteerFields[i]] == "boolean") {
        if (volunteer[numVolunteerFields[i]]) {
          let skillName = numVolunteerFields[i];
          switch (skillName) {
            case "hasPhysicalSkills":
              skillsString += "physical skills,  ";
              break;
            case "hasComputerSkills":
              skillsString += "computer skills,  ";
              break;
            case "hasToolSkills":
              skillsString += "tool skills,  ";
              break;
            case "hasCriminalRecordCheck":
              skillsString += "requires a criminal record check,  ";
              break;
            case "hasCookingSkills":
              skillsString += "cooking skills,  ";
              break;
            case "hasCommunication":
              skillsString += "communication skills,  ";
              break;
            case "hasCustomerService":
              skillsString += "customer service skills,  ";
              break;
            case "hasCprCertification":
              skillsString += "CPR certification,  ";
              break;
            case "hasLift50Lbs":
              skillsString += "must be able to lift 50lbs,  ";
              break;
            case "hasMentoring":
              skillsString += "mentoring skills,  ";
              break;
            case "hasPublicInterationSkills":
              skillsString += "public interation skills,  ";
              break;
            case "hasOrganized":
              skillsString += "organizational skills,  ";
              break;
            case "hasTeamwork":
              skillsString += "teamwork skills,  ";
              break;
          }
        }
      }
    }

    skillsString = skillsString.substring(0, 1).toUpperCase() + skillsString.substring(1, skillsString.length - 3) + "."


    // Update the page
    document.getElementById("volunteerName").textContent = name;
    const img = document.getElementById("volunteerImage");
    let base64String = volunteer.photo1 + volunteer.photo2;
    img.src = `data:img/png;base64,${base64String}`;
    img.alt = `${name} image`;

    document.getElementById("volunteerAddress").textContent = `Address: ${address}`;
    document.getElementById("volunteerCity").textContent = `City: ${city}`;
    document.getElementById("volunteerDateAdded").textContent = `Date Added: ${dateAdded}`;
    document.getElementById("volunteerDateStart").textContent = `Start Date: ${startDate}`;
    document.getElementById("volunteerDateEnd").textContent = `End Date: ${endDate}`;
    document.getElementById("volunteerDescription").textContent = `Description: ${description}`;
    document.getElementById("volunteerFrequency").textContent = `Frequency: ${frequency}`;
    document.getElementById("volunteerSkills").textContent = "Skills: " + skillsString;
    document.getElementById("volunteerEmail").textContent = `Email: ${email}`;
    document.getElementById("volunteerPhoneNum").textContent = `Phone Number: ${phoneNum}`;

    // 1️⃣ FETCH SAVED LIST ONCE HERE
    // This waits for the array ["listings1", "listings4"] to load
    const savedDocIDs = await getSavedListingIds();
    // console.log("User's saved IDs:", savedDocIDs);

    // 4️⃣ DETERMINE ICON STRING SYNCHRONOUSLY
    // If the docID is in our list, use 'bookmark', otherwise 'bookmark_border'
    const iconString = savedDocIDs.includes(docName) ? "bookmark" : "bookmark_border";
    // console.log(iconString);

    document.getElementById("saveIconText").textContent = `${iconString}`;
  } catch (error) {
    console.error("Error loading listing:", error);
    document.getElementById("volunteerName").textContent = "Error loading listing.";
  }
}

// Helper: Get ALL saved listing IDs for the user once
async function getSavedListingIds() {
  const user = auth.currentUser;
  if (!user) return [];

  const subCollectionRef = collection(db, "users", user.uid, "saved-listings");
  const querySnapshot = await getDocs(subCollectionRef);

  // Return an array of strings: ["listings1", "listings2", ...]
  return querySnapshot.docs.map(doc => doc.id);
}

// Handle bookmark toggle clicks
document.getElementById("saveListingOption").addEventListener("click", (e) => {
  // Check if the clicked element is a Material icon
  if (e.target.classList.contains("material-icons-outlined")) {
    const icon = e.target;

    // Toggle only if it’s the bookmark icon
    if (icon.textContent === "bookmark_border") {
      icon.textContent = "bookmark";
      saveListing();
    } else if (icon.textContent === "bookmark") {
      icon.textContent = "bookmark_border";
    }
  }
});

// ---------------------------------
async function saveListing() {
  // gets the current user
  const user = auth.currentUser;
  // tries to find the listing. If any await or document grabbing fails,
  // log the error to the console
  try {
    const listing = currentVolunteerData;
    const userDoc = doc(db, "users", user.uid);
    const savedListings = collection(userDoc, "saved-listings");
    await setDoc(doc(savedListings, listing.docID), {
      ...listing,
    });
  } catch (error) {
    console.log(error);
  }
}

displayVolunteerInfo();
