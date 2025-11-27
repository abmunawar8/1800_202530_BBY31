import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import { checkAuthState } from "./authentication.js"

checkAuthState();

// Cities in BC
// Export this so other files (like set-up-account.js) can use the same list
export const preDefinedSuggestions = [
  "Abbotsford",
  "Burnaby",
  "Coquitlam",
  "Delta",
  "East Vancouver",
  "North Vancouver",
  "Richmond",
  "Tsawwassen",
  "Surrey",
  "West Vancouver",
  "Vancouver"
];

// Get elements
const searchInput = document.getElementById("searchInput");
const suggestions = document.getElementById("suggestions");

// Add event listener to input
searchInput.addEventListener("input", function () {
  const query = searchInput.value.toLowerCase();
  suggestions.innerHTML = "";

  if (query) {
    const filteredResults = preDefinedSuggestions.filter((item) =>
      item.toLowerCase().includes(query)
    );

    filteredResults.forEach((result) => {
      const suggestionItem = document.createElement("div");
      suggestionItem.classList.add("autocomplete-suggestion");
      suggestionItem.textContent = result;
      suggestionItem.addEventListener("click", () => {
        searchInput.value = result;
        suggestions.innerHTML = "";
      });
      suggestions.appendChild(suggestionItem);
    });
  }
});

// Hide suggestions when clicking outside
document.addEventListener("click", function (event) {
  if (event.target !== searchInput) {
    suggestions.innerHTML = "";
  }
});

