class FilterNavbar extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
    <div
      class="container-fluid bg-success-subtle p-2 mt-3 d-flex justify-content-between border border-light rounded-5"
    >
      <button type="button" style="border-radius: 40%;font-size: 15px;font-weight: bold;" onclick="location.href = 'main.html'">Back</button>
      <button type="button" style="border-radius: 40%;font-size: 15px;font-weight: bold;" id="filterButton">Filter</button>
    </div>
    `;
  }
}
 
customElements.define("filter-navbar", FilterNavbar);
