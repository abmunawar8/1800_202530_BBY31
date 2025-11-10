class MainNavbar extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
    <div
      class="container-fluid bg-success-subtle p-2 mt-3 d-flex justify-content-between border border-light rounded-5 top-navbar"
    >
      <span class="material-icons main-footer-icons">search</span>
      <span class="material-icons main-footer-icons" onclick="location.href='filter.html'">filter_list</span>
    </div>
    `;
  }
}

customElements.define("main-navbar", MainNavbar);
