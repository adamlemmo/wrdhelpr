/**
 * Dictionary API Service
 * Handles communication with external dictionary APIs for word search functionality
 */

// API endpoints
const DATAMUSE_API_URL = 'https://api.datamuse.com/words';
const FREE_DICTIONARY_API_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en/';

/**
 * Search for words that start with the given prefix
 * @param {string} prefix - The starting letters to search for
 * @param {Array<{letter: string, count: number}>} letterOccurrences - Optional letter occurrence specifications
 * @returns {Promise<Array>} - Array of matching words with definitions
 */
export async function searchWordsByPrefix(prefix, letterOccurrences = []) {
  try {
    // Datamuse API query for words starting with prefix
    const response = await fetch(`${DATAMUSE_API_URL}?sp=${prefix}*&md=d&max=50`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    let words = await response.json();
    
    // Filter by letter occurrences if specified
    if (letterOccurrences.length > 0) {
      words = filterByLetterOccurrences(words, letterOccurrences);
    }
    
    // Format the response
    return words.slice(0, 20).map(formatWordResult);
  } catch (error) {
    console.error('Error searching words by prefix:', error);
    throw error;
  }
}

/**
 * Search for words that contain the given letters
 * @param {string} letters - The letters that must be contained in the words
 * @param {Array<{letter: string, count: number}>} letterOccurrences - Optional letter occurrence specifications
 * @returns {Promise<Array>} - Array of matching words with definitions
 */
export async function searchWordsByContains(letters, letterOccurrences = []) {
  try {
    // Create a regex pattern that requires all letters to be present
    const letterArray = letters.split('');
    const containsPattern = letterArray.map(letter => `(?=.*${letter})`).join('');
    
    // Datamuse API query for words matching pattern
    const response = await fetch(`${DATAMUSE_API_URL}?sp=*${letters}*&md=d&max=50`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    let words = await response.json();
    
    // Additional client-side filtering to ensure all letters are present
    words = words.filter(word => {
      const wordText = word.word.toLowerCase();
      return letterArray.every(letter => wordText.includes(letter.toLowerCase()));
    });
    
    // Filter by letter occurrences if specified
    if (letterOccurrences.length > 0) {
      words = filterByLetterOccurrences(words, letterOccurrences);
    }
    
    // Format the response
    return words.slice(0, 20).map(formatWordResult);
  } catch (error) {
    console.error('Error searching words by contains:', error);
    throw error;
  }
}

/**
 * Search for words that end with the given suffix
 * @param {string} suffix - The ending letters to search for
 * @param {Array<{letter: string, count: number}>} letterOccurrences - Optional letter occurrence specifications
 * @returns {Promise<Array>} - Array of matching words with definitions
 */
export async function searchWordsByEnding(suffix, letterOccurrences = []) {
  try {
    // Datamuse API query for words ending with suffix
    const response = await fetch(`${DATAMUSE_API_URL}?sp=*${suffix}&md=d&max=50`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    let words = await response.json();
    
    // Filter by letter occurrences if specified
    if (letterOccurrences.length > 0) {
      words = filterByLetterOccurrences(words, letterOccurrences);
    }
    
    // Sort alphabetically
    words.sort((a, b) => a.word.localeCompare(b.word));
    
    // Format the response
    return words.slice(0, 20).map(formatWordResult);
  } catch (error) {
    console.error('Error searching words by ending:', error);
    throw error;
  }
}

/**
 * Get detailed definition for a specific word
 * @param {string} word - The word to look up
 * @returns {Promise<Object>} - Detailed word information
 */
export async function getWordDefinition(word) {
  try {
    const response = await fetch(`${FREE_DICTIONARY_API_URL}${encodeURIComponent(word)}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return formatDetailedDefinition(data);
  } catch (error) {
    console.error('Error getting word definition:', error);
    throw error;
  }
}

/**
 * Filter words based on letter occurrence specifications
 * @param {Array} words - Array of word objects
 * @param {Array<{letter: string, count: number}>} letterOccurrences - Letter occurrence specifications
 * @returns {Array} - Filtered array of words
 */
function filterByLetterOccurrences(words, letterOccurrences) {
  return words.filter(wordObj => {
    const word = wordObj.word.toLowerCase();
    
    return letterOccurrences.every(spec => {
      const letter = spec.letter.toLowerCase();
      const count = spec.count;
      
      // Count occurrences of the letter in the word
      const actualCount = (word.match(new RegExp(letter, 'gi')) || []).length;
      
      // Match if the actual count equals the specified count
      return actualCount === count;
    });
  });
}

/**
 * Format word result from Datamuse API
 * @param {Object} wordData - Word data from API
 * @returns {Object} - Formatted word object
 */
function formatWordResult(wordData) {
  // Extract definition from defs property if available
  const definition = wordData.defs && wordData.defs.length > 0 
    ? wordData.defs[0].replace(/^[a-z]+\s+/, '') // Remove part of speech prefix
    : 'No definition available';
  
  // Extract part of speech if available
  const partOfSpeech = wordData.defs && wordData.defs.length > 0
    ? wordData.defs[0].split(' ')[0]
    : '';
  
  // Count letter occurrences
  const letterOccurrences = {};
  for (const letter of wordData.word.toLowerCase()) {
    if (/[a-z]/.test(letter)) {
      letterOccurrences[letter] = (letterOccurrences[letter] || 0) + 1;
    }
  }
  
  return {
    word: wordData.word,
    definition: definition,
    partOfSpeech: partOfSpeech,
    expanded: false,
    letterOccurrences: letterOccurrences
  };
}

/**
 * Format detailed definition from Free Dictionary API
 * @param {Array} data - API response data
 * @returns {Object} - Formatted detailed definition
 */
function formatDetailedDefinition(data) {
  if (!data || data.length === 0) {
    return {
      word: '',
      phonetics: '',
      meanings: [],
      examples: []
    };
  }
  
  const entry = data[0];
  
  // Extract phonetics
  const phonetics = entry.phonetics && entry.phonetics.length > 0
    ? entry.phonetics[0].text || ''
    : '';
  
  // Extract meanings and examples
  const meanings = [];
  const examples = [];
  
  if (entry.meanings && entry.meanings.length > 0) {
    entry.meanings.forEach(meaning => {
      meanings.push({
        partOfSpeech: meaning.partOfSpeech,
        definitions: meaning.definitions.map(def => def.definition)
      });
      
      // Collect examples
      meaning.definitions.forEach(def => {
        if (def.example) {
          examples.push(def.example);
        }
      });
    });
  }
  
  return {
    word: entry.word,
    phonetics: phonetics,
    meanings: meanings,
    examples: examples.slice(0, 3) // Limit to 3 examples
  };
}

/**
 * Handle API errors with retry logic
 * @param {Function} apiCall - The API call function to execute
 * @param {Array} args - Arguments for the API call
 * @param {number} maxRetries - Maximum number of retry attempts
 * @returns {Promise<any>} - API response or error
 */
export async function withRetry(apiCall, args, maxRetries = 3) {
  let lastError;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      // Exponential backoff delay
      if (attempt > 0) {
        const delay = Math.pow(2, attempt) * 300;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
      
      return await apiCall(...args);
    } catch (error) {
      console.warn(`Attempt ${attempt + 1} failed:`, error);
      lastError = error;
      
      // Don't retry for certain error types
      if (error.message.includes('404')) {
        break;
      }
    }
  }
  
  throw lastError;
}

/**
 * Search for words using a flexible query
 * @param {object} queryParams - The query parameters for the Datamuse API
 * @returns {Promise<Array>} - Array of matching words
 */
export async function searchWords(queryParams) {
  try {
    const params = new URLSearchParams(queryParams);
    const response = await fetch(`${DATAMUSE_API_URL}?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    let words = await response.json();
    
    return words.map(formatWordResult);
  } catch (error) {
    console.error('Error searching words:', error);
    throw error;
  }
}