// Main footer on most pages of the app
// Appears as a light green circle that resizes depending on the user's device width
// Floats on top of other elements (fixed position)
// Is a reusable JavaScript component
class MainFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
    <div
      class="container-fluid footer bg-success-subtle p-2 mb-5 d-flex justify-content-around rounded-5 main-footer"
    >
      <span class="material-icons main-footer-icons" onclick="location.href = 'listings-homepage.html'">sell</span>
      <span class="material-icons main-footer-icons" onclick="location.href = 'main.html'">home</span>
      <span class="material-icons main-footer-icons" onclick="location.href = 'account.html'">account_circle</span>
    </div>
    `;
  }
}

customElements.define("main-footer", MainFooter);
