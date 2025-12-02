import { db } from "./firebaseConfig.js";
import { doc, getDoc } from "firebase/firestore";

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

    const volunteer = volunteerSnap.data();
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
  } catch (error) {
    console.error("Error loading listing:", error);
    document.getElementById("volunteerName").textContent = "Error loading listing.";
  }
}

displayVolunteerInfo();
