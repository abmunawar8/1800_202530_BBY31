import { getId } from "firebase/installations";
import { onAuthReady } from "./authentication.js";
import { db, auth } from "./firebaseConfig.js";
import {
  doc,
  onSnapshot,
  setDoc,
  getDoc,
  getDocs,
  collection,
} from "firebase/firestore";
let cardNumber = 1;

function showDashboard() {
  const nameElement = document.getElementById("name-goes-here"); // the <h1> element to display "Hello, {name}"

  onAuthReady(async (user) => {
    if (!user) {
      // If no user is signed in → redirect back to login page.
      location.href = "index.html";
      return;
    }

    const userDoc = await getDoc(doc(db, "users", user.uid));
    const name = userDoc.exists()
      ? userDoc.data().name
      : user.displayName || user.email;

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
  setTimeout(querySnapshot.forEach((doc) => {
    addNewVolunteeringCard();

    let getIdName = "card-title" + eachListing;
    let cardTitle = document.getElementById(getIdName);
    cardTitle.innerHTML = doc.data().name;

    const cardImg = document.getElementById("card-img" + eachListing);
    cardImg.setAttribute("src", doc.data().photoURL);

    getIdName = "card-distance" + eachListing;
    cardTitle = document.getElementById(getIdName);
    cardTitle.innerHTML = doc.data().address;

    getIdName = "card-date-added" + eachListing;
    cardTitle = document.getElementById(getIdName);
    const date = new Date(doc.data().dateAdded.seconds * 1000)
    let dateString = date.toISOString().substring(0, 10);
    cardTitle.innerHTML = dateString;

    eachListing++;
  }), 1000);
  
}

function addNewVolunteeringCard() {
  const cardLocation = document.getElementById("cards-here");
  let classesToAdd = [
    "col",
    "d-flex",
    "justify-content-center",
    "mb-4",
    "mx-5",
  ];
  const div = document.createElement("div");
  div.classList.add(...classesToAdd);

  const cardHTML =
    `
      <div class="card">
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
              </div>
              <div class="card-right">
                <span class="material-icons-outlined">clear</span>
                <span class="material-icons-outlined">thumb_up</span>
                <span class="material-icons-outlined" id="bookmark` + cardNumber + `">bookmark_border</span>
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
  const querySnapshot = await getDocs(collection(db, "listings"));
  let count = 1;
  querySnapshot.forEach( async (doc) => {
    let currentIcon = document.getElementById("bookmark" + count);
    if (currentIcon.textContent == "bookmark") {
      listingDoc = doc.data();
    }
    count++;
  })
  return listingDoc;
}
// ---------------------------------
async function saveListing() {
  const user = auth.currentUser;
  try {
    const listing = await findSpecificListing();
    console.log(listing.docID);
    const userDoc = doc(db, "users", user.uid);
    const savedListings = collection(userDoc, "saved-listings");
    await setDoc(doc(savedListings, listing.docID), {
      listing
    });
  } catch (error) {
  console.log("failed to get document", error);
  }
}

