// Get the document ID from the URL
function getDocIdFromUrl() {
  const params = new URL(window.location.href).searchParams;
  return params.get("docID");
}

document.addEventListener("DOMContentLoaded", () => {
  const filterButton = document.getElementById("filterButton");

  filterButton.addEventListener("click", () => {
    // 1. Check if at least ONE filter option is selected
    const allInputs = document.querySelectorAll("input[type='checkbox'], input[type='radio']");

    const anySelected = Array.from(allInputs).some((input) => input.checked);

    if (!anySelected) {
      alert("Please select at least one filter option.");
      return;
    }
    // 2. Build TRUE/FALSE list for skills checkboxes
    const skillInputs = document.querySelectorAll("input[name='skills[]']");
    const skillBooleanList = Array.from(skillInputs).map((checkbox) => checkbox.checked);
    // Example output: [true, false, false, true, ...]

    localStorage.setItem("skillsList", JSON.stringify(skillBooleanList));

    // You can redirect, send to backend, store in localStorage, etc.
    window.location.href = "main.html";
  });
});
