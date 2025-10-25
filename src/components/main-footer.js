class MainFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
    <div
      class="container-fluid bg-success-subtle p-2 d-flex justify-content-around border border-light rounded-5 main-footer"
    >
      <span class="material-icons main-footer-icons">sell</span>
      <span class="material-icons main-footer-icons">home</span>
      <span class="material-icons main-footer-icons">account_circle</span>
    </div>
    `;
  }
}

customElements.define("main-footer", MainFooter);
