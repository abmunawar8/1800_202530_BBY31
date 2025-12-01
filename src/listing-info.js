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
    // const skills = volunteer.skills;
    const email = volunteer.contactEmail;
    const phoneNum = volunteer.phoneNum;

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
    // document.getElementById("volunteerSkills").textContent = `Skills: ${skills}`;
    document.getElementById("volunteerEmail").textContent = `Email: ${email}`;
    document.getElementById("volunteerPhoneNum").textContent = `Phone Number: ${phoneNum}`;
  } catch (error) {
    console.error("Error loading listing:", error);
    document.getElementById("volunteerName").textContent = "Error loading listing.";
  }
}

displayVolunteerInfo();
