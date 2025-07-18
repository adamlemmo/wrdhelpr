import { searchWords } from './services/dictionaryService.js';

/**
 * Word Search Feature - Minimal Implementation
 * This provides basic UI functionality without breaking the existing app
 */

/**
 * Initialize word search functionality
 */
export function initWordSearch() {
  console.log('Word search feature initialized');
  
  // Set up real-time input validation
  setupInputValidation();
}

/**
 * Set up real-time input validation for search fields
 */
function setupInputValidation() {
  const userInputEl = document.getElementById('userInput');
  const startsWithInputEl = document.getElementById('startsWithInput');
  const containsInputEl = document.getElementById('containsInput');
  const endsWithInputEl = document.getElementById('endsWithInput');
  const searchInputs = [startsWithInputEl, containsInputEl, endsWithInputEl];

  // When user types in the main input, validate the search fields
  userInputEl.addEventListener('input', () => {
    const allowedLetters = new Set(userInputEl.value.toUpperCase().split(''));
    
    searchInputs.forEach(input => {
      let originalValue = input.value.toUpperCase();
      let filteredValue = originalValue.split('').filter(char => allowedLetters.has(char)).join('');
      
      if (originalValue !== filteredValue) {
        input.value = filteredValue;
      }
    });
  });

  // When user types in a search field, add new letters to the main input
  searchInputs.forEach(input => {
    input.addEventListener('input', () => {
      let cleanedValue = input.value.toUpperCase().replace(/[^A-Z]/g, '');
      if (input.value !== cleanedValue) {
        input.value = cleanedValue;
      }

      const combinedLetters = new Set(userInputEl.value.toUpperCase().split(''));
      cleanedValue.split('').forEach(char => combinedLetters.add(char));
      
      const sortedChars = Array.from(combinedLetters).sort().join('');
      
      if (userInputEl.value !== sortedChars) {
        userInputEl.value = sortedChars;
        // Trigger the input event on userInput to re-validate the other fields
        userInputEl.dispatchEvent(new Event('input'));
      }
    });
  });
}

/**
 * Set up basic search functionality
 */
function setupBasicSearch() {
  const searchForm = document.getElementById('userInputForm');
  if (searchForm) {
    searchForm.addEventListener('submit', function(event) {
      event.preventDefault();
      handleSearch();
    });
  }
}

export async function handleSearch() {
  const userInput = document.getElementById('userInput').value.toUpperCase();
  const startsWithInput = document.getElementById('startsWithInput').value.trim().toLowerCase();
  const containsInput = document.getElementById('containsInput').value.trim().toLowerCase();
  const endsWithInput = document.getElementById('endsWithInput').value.trim().toLowerCase();
  const wordLengthInput = document.getElementById('wordLengthInput');
  const anyLengthToggle = document.getElementById('anyLengthToggle');

  let wordLength = null;
  if (wordLengthInput && anyLengthToggle && !anyLengthToggle.checked) {
    wordLength = parseInt(wordLengthInput.value);
  }

  const queryParams = {
    md: 'd',
    max: 1000,
  };

  // Build the 'spelled like' pattern
  const starts = startsWithInput;
  const ends = endsWithInput;
  const contains = containsInput.split('');
  let sp = `${starts}*${contains.join('*')}*${ends}`;

  // Clean up pattern
  sp = sp.replace(/\*\*+/g, '*'); // Replace multiple wildcards with a single one

  if (sp === '*') {
    if (wordLength > 2) {
      queryParams.sp = '?'.repeat(wordLength);
    } else {
      displayResults('combined', '', []);
      return;
    }
  } else {
    queryParams.sp = sp;
  }

  let results = await searchWords(queryParams);

  // Filter out multi-word results
  results = results.filter(word => !word.word.includes(' '));

  // Filter by length if specified and not already handled by the 'sp' param
  if (wordLength > 2 && queryParams.sp.includes('*')) {
    results = results.filter(word => word.word.length == wordLength);
  }

  // Final filter to ensure all letters in the word can be formed from the user's input
  if (userInput) {
    const userInputFreq = {};
    for (const char of userInput.toUpperCase()) {
        userInputFreq[char] = (userInputFreq[char] || 0) + 1;
    }

    results = results.filter(word => {
        const wordFreq = {};
        for (const char of word.word.toUpperCase()) {
            wordFreq[char] = (wordFreq[char] || 0) + 1;
        }

        for (const char in wordFreq) {
            if (!userInputFreq[char] || wordFreq[char] > userInputFreq[char]) {
                return false; // Letter not available or not enough of them
            }
        }
        return true;
    });
  }

  displayResults('combined', [startsWithInput, containsInput, endsWithInput, wordLength > 2 ? `length ${wordLength}` : ''].filter(Boolean).join(', '), results);
}

document.addEventListener('DOMContentLoaded', () => {
  const wordLengthInput = document.getElementById('wordLengthInput');
  const decreaseButton = document.getElementById('decreaseLength');
  const increaseButton = document.getElementById('increaseLength');
  const anyLengthToggle = document.getElementById('anyLengthToggle');

  if (wordLengthInput && decreaseButton && increaseButton && anyLengthToggle) {
    let lastWordLength = parseInt(wordLengthInput.value); // Store the last valid number

    const setLengthInputState = (disabled, anyChecked) => {
      wordLengthInput.disabled = disabled;
      decreaseButton.disabled = disabled;
      increaseButton.disabled = disabled;
      anyLengthToggle.checked = anyChecked; // Explicitly set the checkbox state
      if (disabled) {
        wordLengthInput.value = '';
      } else {
        wordLengthInput.value = lastWordLength;
      }
    };

    decreaseButton.addEventListener('click', () => {
      let currentValue = parseInt(wordLengthInput.value);
      if (currentValue > parseInt(wordLengthInput.min)) {
        wordLengthInput.value = currentValue - 1;
        lastWordLength = parseInt(wordLengthInput.value); // Update last valid number
      }
      setLengthInputState(false, false); // Enable input, uncheck Any
    });

    increaseButton.addEventListener('click', () => {
      let currentValue = parseInt(wordLengthInput.value);
      if (currentValue < parseInt(wordLengthInput.max)) {
        wordLengthInput.value = currentValue + 1;
        lastWordLength = parseInt(wordLengthInput.value); // Update last valid number
      }
      setLengthInputState(false, false); // Enable input, uncheck Any
    });

    anyLengthToggle.addEventListener('change', () => {
      setLengthInputState(anyLengthToggle.checked, anyLengthToggle.checked);
    });

    // Initialize state based on default checkbox value
    setLengthInputState(anyLengthToggle.checked, anyLengthToggle.checked);
  }
});

/**
 * Display search results
 */
function displayResults(searchType, query, results) {
  const searchResults = document.getElementById('searchResults');
  const loadingIndicator = document.getElementById('loadingIndicator');
  const wordsList = document.getElementById('wordsList');
  const noResults = document.getElementById('noResults');
  const resultsTitle = document.getElementById('resultsTitle');
  
  if (!searchResults || !wordsList || !resultsTitle) return;
  
  // Show results container
  searchResults.style.display = 'block';
  
  // Hide loading and no results
  if (loadingIndicator) loadingIndicator.style.display = 'none';
  if (noResults) noResults.style.display = 'none';

  // Update title
  let searchTypeText = '';
  switch (searchType) {
    case 'starts':
      searchTypeText = 'starting with';
      break;
    case 'contains':
      searchTypeText = 'containing';
      break;
    case 'ends':
      searchTypeText = 'ending with';
      break;
  }
  resultsTitle.textContent = `Words ${searchTypeText} "${query.toUpperCase()}"`;

  // Show results
  if (results && results.length > 0) {
    wordsList.innerHTML = results.map(word => `<div class="word-item">${word.word}</div>`).join('');
  } else {
    noResults.style.display = 'block';
  }
}