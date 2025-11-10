class MainFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
    <div
      class="container-fluid footer bg-success-subtle p-2 mb-5 d-flex justify-content-around border border-light rounded-5 main-footer"
    >
      <span class="material-icons main-footer-icons" onclick="location.href = 'listings-homepage.html'">sell</span>
      <span class="material-icons main-footer-icons" onclick="location.href = 'main.html'">home</span>
      <span class="material-icons main-footer-icons" onclick="location.href = 'account.html'">account_circle</span>
    </div>
    `;
  }
}

customElements.define("main-footer", MainFooter);