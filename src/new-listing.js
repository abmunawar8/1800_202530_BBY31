import { auth, db } from "./firebaseConfig.js";
import { collection, doc, setDoc, getDocs, getDoc } from "firebase/firestore";
import { addSkillBtnListeners } from "./set-up-account.js";

var skillsJSON = {};

async function saveListingInfo() {
  alert("Your new listing is being created. This may take a while.");
  // Gets current user
  const user = auth.currentUser;
  // Create new subcollection
  const userDoc = doc(db, "users", user.uid);
  let createdListings = collection(userDoc, "created-listings");
  // Create name of the new listing
  const querySnapshot = await getDocs(collection(db, "listings"));
  const docID = "listings" + (querySnapshot.size + 1);
  const inputImage = localStorage.getItem("inputImage") || "";
  let imgPart1 = inputImage.substring(0, 500000)
  let imgPart2 = inputImage.substring(500000, inputImage.size)
  // Get the skills buttons
  getSkills();
  // Get the date that it was added
  const now = new Date();
  const dateString = now.toDateString();

  await setDoc(doc(createdListings, docID), {
    address: document.getElementById("address").value,
    city: document.getElementById("city").value,
    name: document.getElementById("listingName").value,
    frequency: document.getElementById("frequency").value,
    description: document.getElementById("description").value,
    startDate: document.getElementById("sdate").value,
    endDate: document.getElementById("edate").value,
    contactEmail: document.getElementById("email").value,
    phoneNum: document.getElementById("phone").value,
    dateAdded: dateString,
    hasCommunication: skillsJSON["hasCommunication"] ?? false,
    hasComputerSkills: skillsJSON["hasComputerSkills"] ?? false,
    hasCookingSkills: skillsJSON["hasCookingSkills"] ?? false,
    hasCprCertification: skillsJSON["hasCprCertification"] ?? false,
    hasCriminalRecordCheck: skillsJSON["hasCriminalRecordCheck"] ?? false,
    hasCustomerService: skillsJSON["hasCustomerService"] ?? false,
    hasLift50Lbs: skillsJSON["hasLift50Lbs"] ?? false,
    hasMentoring: skillsJSON["hasMentoring"] ?? false,
    hasOrganized: skillsJSON["hasOrganized"] ?? false,
    hasPhysicalSkills: skillsJSON["hasPhysicalSkills"] ?? false,
    hasPublicInterationSkills: skillsJSON["hasPublicInterationSkills"] ?? false,
    hasTeamwork: skillsJSON["hasTeamwork"] ?? false,
    hasToolSkills: skillsJSON["hasToolSkills"] ?? false,
    photo1: imgPart1,
    photo2: imgPart2,
    docID: docID,
  });
  // let a = doc(db, "users", user.uid);
  let getCreatedListing = await getDocs(collection(db, "users", user.uid, "created-listings"));
  var data;
  getCreatedListing.forEach( async (doc) => {
    if (doc.data().docID == docID) {
      data = doc.data();
    }
  });
  let listingsRef = collection(db, "listings");
  await setDoc(doc(listingsRef, data.docID), {
    ...data,
  });
  setTimeout(() => {
    window.location.assign("../listings-homepage.html");
  }, 1500);
}

document.getElementById("done-btn").addEventListener("click", saveListingInfo);

function getSkills() {
  let skillBtns = document.getElementsByClassName("skill-btn");
  for (let i = 0; i < skillBtns.length; i++) {
    let currentBtn = document.getElementById(skillBtns[i].id);
    let skillName = currentBtn.id;
    if (currentBtn.dataset.clicked == "true") {
      skillsJSON[skillName] = true;
    } else {
      skillsJSON[skillName] = false;
    }
  }
}

function uploadImage() {
  // Attach event listener to the file input
  // Function to handle file selection and Base64 encoding
  document.getElementById("files").addEventListener("change", handleFileSelect);
  function handleFileSelect(e) {
    var file = e.target.files[0]; // Get the selected file
    if (file) {
      var reader = new FileReader(); // Create a FileReader to read the file
      // When file reading is complete
      reader.onload = function (e) {
        var base64String = e.target.result.split(",")[1]; // Extract Base64 data
        var img = document.createElement("img");
        img.onload = function(event) {
          var canvas = document.createElement("canvas");
          var ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, 250, 300);
          var dataurl = canvas.toDataURL(file.type);
          // document.getElementById("mypic-goes-here").src = e.target.result;
          document.getElementById("mypic-goes-here").src = dataurl;
        }
        img.src = e.target.result;
        ///display the image for user to preview
        // Save to localStorage for now until Post is submitted
        localStorage.setItem("inputImage", base64String);
      };
      // Read the file as a Data URL (Base64 encoding)
      reader.readAsDataURL(file);
    }
  }
}
uploadImage();
