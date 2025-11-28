import { onAuthStateChanged } from "firebase/auth";

import { auth } from "../firebaseConfig.js";
import { logoutUser } from "../authentication.js";

class SiteNavbar extends HTMLElement {
  constructor() {
    super();
    this.renderNavbar();
    this.renderAuthControls();
  }

  renderNavbar() {
    this.innerHTML = `
    <nav class="navbar navbar-expand-sm bg-body-tertiary">
      <div class="container-fluid">
        <a class="navbar-brand" href="../index.html">Volunteering Made Easy</a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a class="nav-link active" aria-current="page" href="main.html">Home</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">About</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">News</a>
            </li>
            </ul>
            <div id="authControls" class="auth-controls d-flex align-items-center gap-2 my-2 my-lg-0">
              <!-- populated by JS -->
            </div>        
        </div>
      </div>
    </nav>
    `;
  }
  renderAuthControls() {
    const authControls = this.querySelector("#authControls");
    console.log("loaded");
    // Initialize with invisible placeholder to maintain layout space
    authControls.innerHTML = `<div class="btn btn-outline-light" style="visibility: hidden; min-width: 70px; margin:8px;">Log out</div>`;

    onAuthStateChanged(auth, (user) => {
      let updatedAuthControl;
      if (user) {
        updatedAuthControl = `<button class="btn btn-success" id="signOutBtn" type="button" style="min-width: 70px; padding:6px 10px; margin:8px;">Log out</button>`;
        authControls.innerHTML = updatedAuthControl;
        const signOutBtn = authControls.querySelector("#signOutBtn");
        signOutBtn?.addEventListener("click", logoutUser);
      } else {
        updatedAuthControl = `<a class="btn btn-success" id="loginBtn" href="/login.html" style="min-width: 70px; padding:6px 10px; margin:8px;">Log in</a>`;
        authControls.innerHTML = updatedAuthControl;
      }
    });
  }
}

customElements.define("site-navbar", SiteNavbar);
