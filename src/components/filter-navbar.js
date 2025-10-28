class FilterNavbar extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
    <div
      class="container-fluid bg-success-subtle p-2 mt-3 d-flex justify-content-between border border-light rounded-5 main-footer"
    >
      <!-- <span class="material-icons main-footer-icons">search</span> -->
      <!-- <span class="material-icons main-footer-icons">filter_list</span> -->
      <button type="button" style="border-radius: 40%;font-size: 15px;font-weight: bold;">Back</button>
      <button type="button" style="border-radius: 40%;font-size: 15px;font-weight: bold;">Filter</button>
    </div>
    `;
  }
}

customElements.define("filter-navbar", FilterNavbar);
