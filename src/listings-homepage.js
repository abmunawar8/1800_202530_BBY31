import { db, auth } from "./firebaseConfig.js";
import { doc, collection, getDocs, deleteDoc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const container = document.getElementById("container");

// gets the listing template
const template = document.getElementById("created-listing-template");

// sets up global variables that will be accessed in multiple methods
var user;
var userDoc;
var totalNumlistings;

// loads in the user's created-listings
onAuthStateChanged(auth, async (e) => {
  if (e) {
    user = e;
    userDoc = doc(db, "users", e.uid);
    let createdListingsRef = collection(userDoc, "created-listings");
    let createdListings = await getDocs(createdListingsRef);
    totalNumlistings = createdListings.size;
    // if the user has at least one created listing
    if (createdListings.size != 0) {
      // looping through the users created listings subcollection
      // uses a <template> for each card
      createdListings.forEach((d) => {
        let copy = template.content.cloneNode(true);
        let listingName = copy.getElementById("listing-name");
        listingName.innerText = d.data().name;
        let docIdName = copy.querySelector(".mb-4");
        docIdName.setAttribute("data-docid", d.data().docID);
        let base64String = d.data().photo1 + d.data().photo2;
        copy.getElementById("listing-image").src = `data:img/png;base64,${base64String}`;
        copy.getElementById("delete-btn").addEventListener("click", async () => {
          await deleteCreatedListing(docIdName.dataset.docid, e);
        });
        container.append(copy);
      });
    } else {
      // if there's no listings, just tell the user they should make one
      showNoListingText();
    }
  } else {
    console.log("no user");
  }
});

// adds text that displays if the user hasn't created any listings
function showNoListingText() {
  let p = document.createElement("p");
  p.innerText = "You haven't created any listings. Click on the Create Listing button to get started!";
  let classesToAdd = ["mx-5", "text-center"]
  p.classList.add(...classesToAdd);
  container.append(p);
}

// deletes the listing from the three different spots where it could be stored:
// from the main listings collection,
// the current user's created-listings subcollection (because they made the listing)
// and from all the other user's saved-listings subcollection
async function deleteCreatedListing(docid, user) {
  deleteDoc(doc(db, "listings", docid));
  deleteDoc(doc(doc(db, "users", user.uid), "created-listings", docid));
  // removes the deleted listing from the user's view
  removeFromDom(docid);
  // deleting document in every other user's saved listings subcollection
  let userDocs = await getDocs(collection(db, "users"));
  userDocs.forEach(async (d) => {
    try {
      // gets ref to current user document we're checking
      let userDocRef = doc(db, "users", d.id);
      let savedListingsDocs = await getDocs(collection(userDocRef, "saved-listings"));
      // savedListingsDocs != null && savedListingsDocs.size != 0
      if (!savedListingsDocs.empty) {
        savedListingsDocs.forEach((doc) => {
          if (doc.docID == docid) {
            deleteDoc(doc(doc(db, "users", user.uid), "saved-listings", docid));
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  });
  // if there was one listing and the user deleted it, then display the "create new listing" text
  totalNumlistings--;
  if (totalNumlistings == 0) {
    showNoListingText();
  }
}

// removes the deleted listing from the DOM so the user visibly sees it's deleted
function removeFromDom(docid) {
  console.log("removeFromDom is running");
  let listing = document.querySelector("[data-docid='" + docid + "']");
  console.log(listing);
  listing.remove();
  listing.innerHTML = "";
}
