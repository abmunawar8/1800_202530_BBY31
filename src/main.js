import { getId } from "firebase/installations";
import { onAuthReady } from "./authentication.js";
import { db, auth } from "./firebaseConfig.js";
import { doc, onSnapshot, setDoc, getDoc, getDocs, collection } from "firebase/firestore";
let cardNumber = 1;
var displayedDocs = [];

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

async function showVolunteerListings() {
  const querySnapshot = await getDocs(collection(db, "listings"));
  let eachListing = 1;
  querySnapshot.forEach(async (doc) => {
    let checker = true;
    if (document.referrer.includes("filter.html")) {
      // **console.log("Came from filter.html");**
      const skillBooleanList = JSON.parse(localStorage.getItem("skillsList"));
      checker = await filterForMatchingSkills(doc.ref,skillBooleanList);
    } else {
      // **console.log("Came from another page");**
      checker = await checkForMatchingSkills(doc.ref);
    }

    
    //let checker = await checkForMatchingSkills(doc.ref);
    // console.log(checker);
    // console.log(document.referrer);
    // const skillBooleanList = JSON.parse(localStorage.getItem("skillsList"));
    // console.log("Skill Booleans:", skillBooleanList);

    if (checker) {
      displayedDocs[displayedDocs.length] = doc.data();
      addNewVolunteeringCard(doc.data().docID);

      const cardContainer = document.querySelector(`#cards-here > .col:nth-child(${eachListing})`);

      if (cardContainer) {
        const readMoreLink = cardContainer.querySelector(".read-more");
        readMoreLink.href = `listing-info.html?docID=${doc.id}`;
      }

      let getIdName = "card-title" + eachListing;
      let cardTitle = document.getElementById(getIdName);
      cardTitle.innerHTML = doc.data().name;

      const cardImg = document.getElementById("card-img" + eachListing);
      let base64String = doc.data().photo1 + doc.data().photo2;
      cardImg.src = `data:img/png;base64,${base64String}`;

      getIdName = "card-distance" + eachListing;
      cardTitle = document.getElementById(getIdName);
      cardTitle.innerHTML = doc.data().address;

      getIdName = "card-date-added" + eachListing;
      cardTitle = document.getElementById(getIdName);
      let dateString = doc.data().dateAdded;
      cardTitle.innerHTML = dateString;

      eachListing++;
    }
  });
}

function addNewVolunteeringCard(docID) {
  const cardLocation = document.getElementById("cards-here");
  let classesToAdd = ["col", "d-flex", "justify-content-center", "mb-4", "mx-5"];
  const div = document.createElement("div");
  div.classList.add(...classesToAdd);

  const cardHTML =
    `
      <div class="card" data-docid="` + docID + `">
        <div class="row g-0">
          <div class="col-4">
            <img
              class="rounded-start img-fluid"
              alt="dummy image" 
              id="card-img` +
    cardNumber +
    `"/>
          </div>
          <div class="col-8">
            <div class="card-body custom-card">
              <div class="card-left">
                <h5 class="card-title"><span id="card-title` +
    cardNumber +
    `"></span></h5>
                <p class="card-text">
                  <b>Address:</b> <span id="card-distance` +
    cardNumber +
    `"></span><br />
                  <b>Skills:</b> <span id="card-skills` +
    cardNumber +
    `">To be implemented next sprint</span><br />
                </p>
                <p class="card-text">
                  <small class="text-body-secondary"
                    >Date Added: <span id="card-date-added` +
    cardNumber +
    `"></span></small
                  >
                </p>
                <a class="btn btn-primary read-more" href="#">Read More</a>
              </div>
              <div class="card-right">
                <span class="material-icons-outlined">clear</span>
                <span class="material-icons-outlined">thumb_up</span>
                <span class="material-icons-outlined" id="bookmark` +
    cardNumber +
    `">bookmark_border</span>
              </div>
            </div>
          </div>
        </div>
      </div>
  `;
  div.innerHTML = cardHTML;
  cardLocation.append(div);
  cardNumber++;
}

async function checkForMatchingSkills(docRef) {
  // const id = getDocIdFromUrl();

  try {
    // const volunteerRef = doc(db, "listings", id);
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
    // console.log(skillDetails);

    const user = auth.currentUser;
    if (!user) return [];

    const skillsArray = []; // ← final result

    const userDoc = doc(db, "users", user.uid);
    const userSkillsCol = collection(userDoc, "user-skills");

    const snapshot = await getDocs(userSkillsCol);

    snapshot.forEach((skillDoc) => {
      const skillId = skillDoc.id; // e.g. "cooking", "cleaning"
      const hasSkillStr = skillDoc.data().hasSkill; // "true" or "false"

      // convert to real boolean
      const hasSkill = hasSkillStr == "true";

      // push structured entry into the list
      skillsArray.push(hasSkill);
    });

    // **console.log("Listing Booleans:", skillDetails);**
    // **console.log("Skill Booleans:", skillsArray);**

    // checks for a match if the chosen document and the user skill has at least one of the same
    for (let i = 0; i < skillDetails.length; i++) {
      if (skillDetails[i] === true && skillsArray[i] === true) {
        // console.log(true);
        return true; // or break if you're inside a function
      }
    }

    // console.log(false);
    return false;
  } catch (error) {
    console.error("Error loading listing:", error);
    document.getElementById("volunteerName").textContent = "Error loading listing.";
  }
}

async function filterForMatchingSkills(docRef,skillsList) {
  // const id = getDocIdFromUrl();

  try {
    // const volunteerRef = doc(db, "listings", id);
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
    // console.log(skillDetails);

    const user = auth.currentUser;
    if (!user) return [];

    // const skillsArray = []; // ← final result

    // const userDoc = doc(db, "users", user.uid);
    // const userSkillsCol = collection(userDoc, "user-skills");

    // const snapshot = await getDocs(userSkillsCol);

    // snapshot.forEach((skillDoc) => {
      // const skillId = skillDoc.id;                 // e.g. "cooking", "cleaning"
      // const hasSkillStr = skillDoc.data().hasSkill; // "true" or "false"

      // convert to real boolean
      // const hasSkill = hasSkillStr === "true";

      // push structured entry into the list
      // skillsArray.push(hasSkill);
    // });

    // **console.log("Listing Booleans:", skillDetails);**
    // **console.log("Filter Booleans:", skillsList);**

    for (let i = 0; i < skillDetails.length; i++) {
      if (skillDetails[i] === true && skillsList[i] === true) {
        // **console.log(true);**
        return true;  // or break if you're inside a function
      }
    }

    // **console.log(false);**
    return false;
  } catch (error) {
    console.error("Error loading listing:", error);
    document.getElementById("volunteerName").textContent = "Error loading listing.";
  }
}

showDashboard();

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

// ------------------------------
async function findSpecificListing() {
  var listingDoc;
  let count = 1;
  for (let i = 0; i < displayedDocs.length; i++) {
    let currentIcon = document.getElementById("bookmark" + count);
    try {
      if (currentIcon.innerText == "bookmark") {
        console.log(currentIcon);
        listingDoc = displayedDocs[i];
        console.log(listingDoc)
        break;
      }
    } catch (error) {
      console.log(error);
    }
    count++;
  }

  return listingDoc;
}
// ---------------------------------
async function saveListing() {
  const user = auth.currentUser;
  try {
    const listing = await findSpecificListing();
    console.log(listing);
    const userDoc = doc(db, "users", user.uid);
    const savedListings = collection(userDoc, "saved-listings");
    await setDoc(doc(savedListings, listing.docID), {
      ...listing,
    });
  } catch (error) {
    console.log("failed to get document", error);
  }
}
