import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "./firebaseConfig.js";

// -------------------------------------------------------------
// Function to populate user info in the profile form
// Fetches user data from Firestore and fills in the form fields
// Assumes user is already authenticated
// and their UID corresponds to a document in the "users" collection
// of Firestore.
// Fields populated: name, school, city
// Form field IDs: nameInput, schoolInput, cityInput
// -------------------------------------------------------------
function populateUserInfo() {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            try {
                // reference to the user document
                const userRef = doc(db, "users", user.uid);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    const userData = userSnap.data();

                    const { name = "", country = "", phoneNum = "" } = userData;

                    document.getElementById("nameInput").value = name;
                    document.getElementById("countryInput").value = country;
                    document.getElementById("phoneInput").value = phoneNum;
                } else {
                    console.log("No such document!");
                }
            } catch (error) {
                console.error("Error getting user document:", error);
            }
        } else {
            console.log("No user is signed in");
        }
    });
}

//call the function to run it 
populateUserInfo();

//-------------------------------------------------------------
// Function to enable editing of user info form fields
//------------------------------------------------------------- 
document.querySelector('#editButton').addEventListener('click', editUserInfo);
function editUserInfo() {
    //Enable the form fields
    document.getElementById('personalInfoFields').disabled = false;
}

//-------------------------------------------------------------
// Function to save updated user info from the profile form
//-------------------------------------------------------------
document.querySelector('#saveButton').addEventListener('click', saveUserInfo);   //Add event listener for save button
async function saveUserInfo() {
    const user = auth.currentUser;   // ✅ get the currently logged-in user
    if (!user) {
        alert("No user is signed in. Please log in first.");
        return;
    }
    //enter code here

    //a) get user entered values
    const userName = document.getElementById('nameInput').value;       //get the value of the field with id="nameInput"
    const userCountry = document.getElementById('countryInput').value;     //get the value of the field with id="countryInput"
    const userPhoneNum = document.getElementById('phoneInput').value;       //get the value of the field with id="phoneInput"

    //b) update user's document in Firestore
    await updateUserDocument(user.uid, userName, userCountry, userPhoneNum);

    //c) disable edit
    document.getElementById('personalInfoFields').disabled = true; 
}

//-------------------------------------------------------------
// Updates the user document in Firestore with new values
// Parameters:
//   uid (string)  – user’s UID
//   name, school, city (strings)
//-------------------------------------------------------------
async function updateUserDocument(uid, name, country, phoneNum) {
  try {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, { name, country, phoneNum });
    console.log("User document successfully updated!");
  } catch (error) {
    console.error("Error updating user document:", error);
  }
}
