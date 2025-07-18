import { initWordSearch, handleSearch } from './wordSearch.js';

export function initApp() {
  const url = new URL(window.location);
  const sharedTitle = url.searchParams.get("title");
  const sharedText = url.searchParams.get("text");
  const sharedUrl = url.searchParams.get("url");

  const userInputField = document.getElementById("userInput");
  if (!userInputField) return; // safety: exit if DOM not ready

  const calculateAndDisplayMissingLetters = () => {
    const userInput = userInputField.value;
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let missingLetters = "";

    for (let i = 0; i < alphabet.length; i++) {
      if (userInput.indexOf(alphabet[i]) === -1) {
        missingLetters += alphabet[i];
      }
    }

    const resultDiv = document.getElementById("result");
    resultDiv.textContent = missingLetters;
  };

  if (sharedText) {
    userInputField.value = sharedText.toUpperCase().replace(/[^A-Z]/g, "");
  } else if (sharedTitle) {
    userInputField.value = sharedTitle.toUpperCase().replace(/[^A-Z]/g, "");
  } else if (sharedUrl) {
    userInputField.value = sharedUrl.toUpperCase().replace(/[^A-Z]/g, "");
  }

  userInputField.addEventListener("keyup", function () {
    let cleanedInput = this.value.toUpperCase().replace(/[^A-Z]/g, "");
    this.value = cleanedInput;
    calculateAndDisplayMissingLetters();
  });

  document.getElementById("userInputForm").addEventListener("submit", function (event) {
    event.preventDefault();
    handleSearch();
  });

  document.getElementById("copyBtn").addEventListener("click", function () {
    const resultText = document.getElementById("result").textContent;
    navigator.clipboard
      .writeText(resultText)
      .then(() => showToast("Copied to clipboard!"))
      .catch((err) => console.error("Copy failed:", err));
  });

  // Initialize word search UI elements
  try {
    if (typeof initWordSearch === 'function') {
      initWordSearch();
    }
  } catch (error) {
    console.log('Word search feature not available:', error);
  }

  function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 2000);
  }

  // Initial calculation on load
  calculateAndDisplayMissingLetters();
}
