

const url = new URL(window.location);
const sharedTitle = url.searchParams.get("title");
const sharedText = url.searchParams.get("text");
const sharedUrl = url.searchParams.get("url");

const userInputField = document.getElementById("userInput");

if (sharedText) {
  userInputField.value = sharedText.toUpperCase().replace(/[^A-Z]/g, '');
} else if (sharedTitle) {
  userInputField.value = sharedTitle.toUpperCase().replace(/[^A-Z]/g, '');
} else if (sharedUrl) {
  userInputField.value = sharedUrl.toUpperCase().replace(/[^A-Z]/g, '');
}




userInputField.addEventListener("keyup", function() {
  let cleanedInput = this.value.toUpperCase().replace(/[^A-Z]/g, '');
  this.value = cleanedInput;
});

document.getElementById("userInputForm").addEventListener("submit", function (event) {
  event.preventDefault();

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
  resultDiv.style.display = "block";

  const copyBtn = document.getElementById("copyBtn");
  copyBtn.style.display = "inline-block"; // Show the copy button
});

// Copy result text to clipboard
document.getElementById("copyBtn").addEventListener("click", function () {
  const resultText = document.getElementById("result").textContent;
  navigator.clipboard
    .writeText(resultText)
    .then(() => alert("Copied to clipboard!"))
    .catch((err) => console.error("Copy failed:", err));
});

