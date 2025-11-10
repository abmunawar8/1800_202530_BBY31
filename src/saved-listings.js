// src/pages/saved-listings.js

// Import initialized Firebase services
import { auth, db } from "./firebaseConfig.js";

// Firebase modular APIs
import {
  onAuthStateChanged
} from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  documentId,
  deleteDoc
} from "firebase/firestore";

// ---------- DOM ----------
const mount = document.getElementById("saved-listings");
const tpl = document.getElementById("saved-card-tpl");

function renderEmpty() {
  mount.innerHTML = `
    <div class="text-center text-muted py-5">
      <div class="mb-2">You have no saved listings yet.</div>
      <div class="small">Go explore and tap the bookmark icon to save one.</div>
    </div>
  `;
}

function createCard({ id, title, subtitle, imageUrl }) {
  const frag = tpl.content.cloneNode(true);
  const card = frag.querySelector(".saved-card");
  card.dataset.id = id;

  const img = frag.querySelector(".saved-card-img");
  img.src = imageUrl || "https://via.placeholder.com/72?text=Img";
  img.alt = title || "listing";

  frag.querySelector(".saved-card-title").textContent = title || "Untitled";
  frag.querySelector(".saved-card-sub").textContent = subtitle || "";

 // close = unsave and remove the listing card
frag.querySelector(".action-close").addEventListener("click", async () => {
  try {
    // Remove this saved listing from Firestore
    await unsave(card.dataset.id);

    // Remove the card element from the page
    card.remove();

    // If no cards remain, render the "empty" message
    if (!mount.children.length) renderEmpty();
  } catch (e) {
    console.error(e);
    alert("Failed to remove from saved. Please try again.");
  }
});


  return frag;
}

// ---------- Firestore helpers ----------

// Get saved listing IDs from /users/{uid}/saved (doc IDs are listingIds)
async function getSavedIds(uid) {
  const savedCol = collection(db, "users", uid, "saved-listings");
  const snap = await getDocs(savedCol);
  const ids = [];
  snap.forEach(d => ids.push(d.id));
  return ids;
}

// Batch fetch listings by IDs from /listings (chunk size 10 for 'in' query)
async function getListings(ids) {
  if (!ids.length) return [];

  const chunk = (arr, size) =>
    Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
      arr.slice(i * size, i * size + size)
    );

  const chunks = chunk(ids, 10);
  const results = [];

  for (const c of chunks) {
    const qRef = query(collection(db, "listings"), where(documentId(), "in", c));
    const snap = await getDocs(qRef);
    snap.forEach(d => {
      const v = d.data();
      results.push({
        id: d.id,
        title: v.name || "Untitled",
        subtitle: v.city || "",
        imageUrl: v.photoURL || ""
      });
    });
  }

  // In case some IDs are not found by 'in' (e.g., leftover single)
  if (results.length < ids.length) {
    const found = new Set(results.map(r => r.id));
    const missing = ids.filter(id => !found.has(id));
    for (const id of missing) {
      const docRef = doc(db, "listings", id);
      const ds = await getDoc(docRef);
      if (ds.exists()) {
        const v = ds.data();
        results.push({
          id: ds.id,
          title: v.name || "Untitled",
          subtitle: v.city || "",
          imageUrl: v.photoURL || ""
        });
      }
    }
  }

  return results;
}

// Delete /users/{uid}/saved/{listingId}
async function unsave(listingId) {
  const user = auth.currentUser;
  if (!user) throw new Error("Not signed in");
  const ref = doc(db, "users", user.uid, "saved-listings", listingId);
  await deleteDoc(ref);
}

// ---------- Main ----------
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    mount.innerHTML = `
      <div class="text-center py-5">
        <div class="mb-2">Please sign in to view your saved listings.</div>
        <a class="btn btn-primary" href="login.html">Sign in</a>
      </div>
    `;
    return;
  }

  try {
    // 1) get saved IDs
    const ids = await getSavedIds(user.uid);
    if (!ids.length) {
      renderEmpty();
      return;
    }

    // 2) fetch listing docs
    const items = await getListings(ids);
    if (!items.length) {
      renderEmpty();
      return;
    }

    // 3) render
    mount.innerHTML = "";
    const frag = document.createDocumentFragment();
    items.forEach((item) => frag.appendChild(createCard(item)));
    mount.appendChild(frag);
  } catch (e) {
    console.error(e);
    mount.innerHTML = `
      <div class="alert alert-danger my-4">
        Failed to load saved listings. Please try again later.
      </div>
    `;
  }
});
