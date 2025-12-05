import { onAuthReady } from "./authentication.js";
import { db, auth } from "./firebaseConfig.js";
import { doc, setDoc, getDoc, getDocs, collection } from "firebase/firestore";
let cardNumber = 1;
var displayedDocs = [];

// The main function that displays listings to the user
// If there's a user, call showVolunteerListings, which handles
// the brunt of the reading from the database
function showDashboard() {
  const nameElement = document.getElementById("name-goes-here"); // the <h1> element to display "Hello, {name}"
  onAuthReady(async (user) => {
    if (!user) {
      // If no user is signed in → redirect back to login page.
      location.href = "index.html";
      return;
    }
    const userDoc = await getDoc(doc(db, "users", user.uid));
    const name = userDoc.exists() ? userDoc.data().name : user.displayName || user.email;
    // Update the welcome message with their name/email.
    if (nameElement) {
      nameElement.textContent = `${name}`;
    }
    // shows the appropriate volunteer listings depending on what skills the user has
    showVolunteerListings();
  });
}

// reads the listings from the listings collection and displays them to the user
async function showVolunteerListings() {
  // gets a snapshot of all the docs in the listings collection in Firebase
  const querySnapshot = await getDocs(collection(db, "listings"));

  // 1️⃣ FETCH SAVED LIST ONCE HERE
  // This waits for the array ["listings1", "listings4"] to load
  const savedDocIDs = await getSavedListingIds();
  // console.log("User's saved IDs:", savedDocIDs);

  let eachListing = 1;
  // iterates through each listing in the document
  querySnapshot.forEach(async (doc) => {
    let checker = true;
    if (document.referrer.includes("filter.html")) {
      const skillBooleanList = JSON.parse(localStorage.getItem("skillsList"));
      checker = await filterForMatchingSkills(doc.ref, skillBooleanList);
    } else {
      checker = await checkForMatchingSkills(doc.ref);
    }

    // checker is a boolean that represents if the listing has at least one of the skills that the user has
    // if the user does share a skill with the listing, then display the card
    if (checker) {
      displayedDocs[displayedDocs.length] = doc.data();
      // 2️⃣ PASS THE SAVED LIST TO THE FUNCTION
      addNewVolunteeringCard(doc.data().docID, savedDocIDs);

      const cardContainer = document.querySelector(`#cards-here > .col:nth-child(${eachListing})`);

      if (cardContainer) {
        const readMoreLink = cardContainer.querySelector(".read-more");
        readMoreLink.href = `listing-info.html?docID=${doc.id}`;
      }

      // sets the name of the listing
      let getIdName = "card-title" + eachListing;
      let cardTitle = document.getElementById(getIdName);
      cardTitle.innerHTML = doc.data().name;

      // sets the image
      const cardImg = document.getElementById("card-img" + eachListing);
      // since Firebase documents can only hold 1mb each, the base64 string was split into two strings
      // the strings are concatenated back together and then the data is specified as a base64 string
      // to make it properly show up
      let base64String = doc.data().photo1 + doc.data().photo2;
      cardImg.src = `data:img/png;base64,${base64String}`;

      // card distance (address) is set
      getIdName = "card-distance" + eachListing;
      cardTitle = document.getElementById(getIdName);
      cardTitle.innerHTML = doc.data().address;

      // date when the listing was created was set
      getIdName = "card-date-added" + eachListing;
      cardTitle = document.getElementById(getIdName);
      let dateString = doc.data().dateAdded;
      cardTitle.innerHTML = dateString;

      eachListing++;
    }
  });
}

// creates a new volunteering listing with data from the database
// cardHTML is a template for each card
// ...deconstructor adds all the classes in the classToAdd array to the template
function addNewVolunteeringCard(docID, savedDocIDs) {
  const cardLocation = document.getElementById("cards-here");
  let classesToAdd = ["col", "d-flex", "justify-content-center", "mb-4", "mx-5"];
  const div = document.createElement("div");
  div.classList.add(...classesToAdd);

  // 4️⃣ DETERMINE ICON STRING SYNCHRONOUSLY
  // If the docID is in our list, use 'bookmark', otherwise 'bookmark_border'
  const iconString = savedDocIDs.includes(docID) ? "bookmark" : "bookmark_border";
  // console.log(iconString);

  // Template literal that represents each listing card
  // cardNumber is concatenated to programmatically differentiate IDs
  const cardHTML =
    `<div class="card" data-docid="` + docID + `">
      <div class="row g-0">
        <div class="col-4">
          <img
            class="rounded-top card-img"
            alt="dummy image" 
            id="card-img` + cardNumber + `"/>
        </div>
        <div class="col-8">
          <div class="card-body custom-card">
            <div class="card-left">
              <h5 class="card-title"><span id="card-title` + cardNumber + `"></span></h5>
                <p class="card-text">
                  <b>Address:</b> <span id="card-distance` + cardNumber +`"></span></br>
                  <small class="text-body-secondary">Date Added: <span id="card-date-added` + cardNumber + `"></span></small>
                </p>
                <a class="btn btn-primary read-more w-75" href="#">Read More</a>
              </div>
              <div class="card-right">
                <span class="material-icons-outlined">clear</span>
                <span class="material-icons-outlined">thumb_up</span>
                <span class="material-icons-outlined" id="bookmark` + cardNumber + `">${iconString}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`;
  // adds the template literal to the div's inner html
  div.innerHTML = cardHTML;
  // adds the card at the end of the list
  cardLocation.append(div);
  // increments the card number so the ids for the next card are correct
  cardNumber++;
}

// Looks through the current listing document's skills (as pointed to by docRef)
// and checks to see if the current user has at least one of the skills.
// If they do, return true, false otherwise.
// This function gets called if the user is on main.html. A similar function
// is called if the user is on filter.html.
async function checkForMatchingSkills(docRef) {
  try {
    const volunteerSnap = await getDoc(docRef);
    const volunteer = volunteerSnap.data();

    // The detail constants
    // A list of skill flags extracted from the 'volunteer' object.
    const skillDetails = [
      volunteer.hasCommunication,
      volunteer.hasComputerSkills,
      volunteer.hasCookingSkills,
      volunteer.hasCprCertification,
      volunteer.hasCriminalRecordCheck,
      volunteer.hasCustomerService,
      volunteer.hasLift50Lbs,
      volunteer.hasMentoring,
      volunteer.hasOrganized,
      volunteer.hasPhysicalFitness,
      volunteer.hasPublicInteration,
      volunteer.hasTeamwork,
      volunteer.hasToolSkills,
    ];

    const user = auth.currentUser;
    if (!user) return [];

    const skillsArray = []; // ← final result

    const userDoc = doc(db, "users", user.uid);
    const userSkillsCol = collection(userDoc, "user-skills");

    const snapshot = await getDocs(userSkillsCol);

    snapshot.forEach((skillDoc) => {
      const hasSkillStr = skillDoc.data().hasSkill; // "true" or "false"

      var hasSkill;
      // convert to real boolean
      if (typeof hasSkillStr == "boolean") {
        hasSkill = hasSkillStr;
      } else {
        hasSkill = hasSkillStr == "true";
      }

      // push structured entry into the list
      skillsArray.push(hasSkill);
    });

    // checks for a match if the chosen document and the user skill has at least one of the same
    for (let i = 0; i < skillDetails.length; i++) {
      if (skillDetails[i] === true && skillsArray[i] === true) {
        return true; // or break if you're inside a function
      }
    }
    return false;
  } catch (error) {
    console.error("Error loading listing:", error);
    document.getElementById("volunteerName").textContent = "Error loading listing.";
  }
}

// Returns true if a document (given by the path docRef) has at least
// one of the skills in skillsList. Returns false otherwise.
// Returns an empty array of skills if there's no user.
// This function is similar to checkForMatchingSkills. However, this
// function is designed for filter.html.
async function filterForMatchingSkills(docRef, skillsList) {
  try {
    const volunteerSnap = await getDoc(docRef);
    const volunteer = volunteerSnap.data();

    // The detail constants
    // A list of skill flags extracted from the 'volunteer' object.
    const skillDetails = [
      volunteer.hasCommunication,
      volunteer.hasComputerSkills,
      volunteer.hasCookingSkills,
      volunteer.hasCprCertification,
      volunteer.hasCriminalRecordCheck,
      volunteer.hasCustomerService,
      volunteer.hasLift50Lbs,
      volunteer.hasMentoring,
      volunteer.hasOrganized,
      volunteer.hasPhysicalFitness,
      volunteer.hasPublicInteration,
      volunteer.hasTeamwork,
      volunteer.hasToolSkills,
    ];

    const user = auth.currentUser;
    if (!user) return [];
    for (let i = 0; i < skillDetails.length; i++) {
      if (skillDetails[i] === true && skillsList[i] === true) {
        return true; // or break if you're inside a function
      }
    }
    return false;
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
  return querySnapshot.docs.map((doc) => doc.id);
}

// Handle bookmark toggle clicks
document.getElementById("cards-here").addEventListener("click", (e) => {
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

// finds the specific listing based off the bookmark that user clicked
// saves the listing to listingDoc, a global variable
// a helper function for saveListing
async function findSpecificListing() {
  var listingDoc;
  let count = 1;
  for (let i = 0; i < displayedDocs.length; i++) {
    let currentIcon = document.getElementById("bookmark" + count);
    // console.log("bookmark" + count);
    try {
      if (currentIcon.innerText == "bookmark") {
        listingDoc = displayedDocs[i];
        break;
      }
    } catch (error) {
      console.log(error);
    }
    count++;
  }
  return listingDoc;
}

// Saves the clicked on listing to the current user's saved-listings collection
async function saveListing() {
  // gets the current user
  const user = auth.currentUser;
  // tries to find the listing. If any await or document grabbing fails,
  // log the error to the console
  try {
    const listing = await findSpecificListing();
    const userDoc = doc(db, "users", user.uid);
    const savedListings = collection(userDoc, "saved-listings");
    await setDoc(doc(savedListings, listing.docID), {
      ...listing,
    });
  } catch (error) {
    console.log(error);
  }
}

// Starts the entire chain of functions to display listings to the user
showDashboard();
