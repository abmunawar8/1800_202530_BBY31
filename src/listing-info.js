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
        const code = volunteer.code;

        // The detail constants
        const address = volunteer.address;
        const city = volunteer.city;
        const postalCode = volunteer.postalCode;
        const description = volunteer.description;
        // const skills = volunteer.skills;
        const email = volunteer.contactEmail;
        const phoneNum = volunteer.phoneNum;

        // Update the page
        document.getElementById("volunteerName").textContent = name;
        const img = document.getElementById("volunteerImage");
        img.src = `./images/${code}.png`;
        img.alt = `${name} image`;

        document.getElementById("volunteerAddress").textContent = `Address: ${address}`;
        document.getElementById("volunteerCity").textContent = `City: ${city}`;
        document.getElementById("volunteerPostalCode").textContent = `Postal Code: ${postalCode}`;
        document.getElementById("volunteerDescription").textContent = `Description: ${description}`;
        // document.getElementById("volunteerSkills").textContent = `Skills: ${skills}`;
        document.getElementById("volunteerEmail").textContent = `Email: ${email}`;
        document.getElementById("volunteerPhoneNum").textContent = `Phone Number: ${phoneNum}`;
    } catch (error) {
        console.error("Error loading listing:", error);
        document.getElementById("volunteerName").textContent = "Error loading listing.";
    }
}

displayVolunteerInfo();
