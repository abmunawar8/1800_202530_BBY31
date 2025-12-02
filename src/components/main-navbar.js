// Main navbar that primarily exists on the Main Page
// Appears as a light green circle that stays at the top of the screen (is not fixed in place)
class MainNavbar extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
    <div
      class="container-fluid bg-success-subtle p-2 mt-3 d-flex justify-content-between border border-light rounded-5 top-navbar"
    >
      <span class="material-icons main-footer-icons" style="margin-left: auto;" onclick="location.href='filter.html'">filter_list</span>
    </div>
    `;
  }
}

customElements.define("main-navbar", MainNavbar);
