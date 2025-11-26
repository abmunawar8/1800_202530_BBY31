import { db, auth } from "./firebaseConfig.js";
import { doc, collection, getDocs, deleteDoc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const container = document.getElementById("container");
const template = document.getElementById("created-listing-template");

var user;
var userDoc;
var totalNumlistings;
onAuthStateChanged(auth, async (e) => {
  if (e) {
    user = e;
    userDoc = doc(db, "users", e.uid);
    let createdListingsRef = collection(userDoc, "created-listings");
    let createdListings = await getDocs(createdListingsRef);
    totalNumlistings = createdListings.size;
    if (createdListings.size != 0) {
      createdListings.forEach((d) => {
        let copy = template.content.cloneNode(true);
        let listingName = copy.getElementById("listing-name");
        listingName.innerText = d.data().name;
        let docIdName = copy.querySelector(".mx-5");
        docIdName.setAttribute("data-docid", d.data().docID);
        let base64String = d.data().photo1 + d.data().photo2;
        copy.getElementById("listing-image").src = `data:img/png;base64,${base64String}`;
        copy.getElementById("delete-btn").addEventListener("click", async () => deleteCreatedListing(docIdName.dataset.docid, e));
        container.append(copy);
      });
    } else {
      showNoListingText();
    }
  } else {
    console.log("no user");
  }
});

function showNoListingText() {
  let p = document.createElement("p");
  p.innerText = "You haven't created any listings. Click on the Create Listing button to get started!";
  container.append(p);
}

async function deleteCreatedListing(docid, user) {
  deleteDoc(doc(db, "listings", docid));
  deleteDoc(doc(doc(db, "users", user.uid), "created-listings", docid));
  let userDocs = await getDocs(collection(db, "users"));
  userDocs.forEach((d) => {
    let savedListingsRef = collection(d, "saved-listings");
    if (savedListingsRef.size != 0) {
      savedListingsRef.forEach((doc) => {
        if (doc.docID == docid) {
          () => {
            deleteDoc(doc(doc(db, "users", user.uid), "saved-listings", docid));
          };
        }
      });
    }
  });
  totalNumlistings--;
  let createdListing = document.querySelector("[data-docid=" + docid + "]");
  console.log(createdListing);
  // createdListing.remove();
  // createdListing.innerHTML = "";
  if (totalNumlistings == 0) {
    showNoListingText();
  }
}
