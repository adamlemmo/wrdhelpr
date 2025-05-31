if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/service-worker.js")
    .then(() => console.log("Service Worker registered"))
    .catch((err) => console.error("Service Worker error:", err));
}
// Show missing letters and reveal the copy button
document.getElementById("userInputForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const userInput = document.getElementById("userInput").value.toUpperCase();
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
function autoCopy() {
  const code = `npm run bump`;
  navigator.clipboard
    .writeText(code)
    .then(() => alert("Copied to clipboard!"))
    .catch((err) => console.error("Copy failed:", err));
}
