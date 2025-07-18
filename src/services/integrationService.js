/**
 * Integration Service
 * Connects the word search feature with existing functionality
 */

/**
 * Transfer letters from the missing letters tool to the word search
 * @param {string} letters - Letters from the missing letters tool
 * @param {string} searchType - Type of search to populate ('starts', 'contains', 'ends')
 * @returns {boolean} - Success status
 */
export function transferLettersToSearch(letters, searchType = 'contains') {
  try {
    if (!letters) {
      return false;
    }
    
    // Get the appropriate search input based on search type
    const searchInputId = getSearchInputId(searchType);
    const searchInput = document.getElementById(searchInputId);
    
    if (!searchInput) {
      return false;
    }
    
    // Set the value of the search input
    searchInput.value = letters.toUpperCase();
    
    // Trigger any necessary events
    const event = new Event('input', { bubbles: true });
    searchInput.dispatchEvent(event);
    
    return true;
  } catch (error) {
    console.error('Error transferring letters to search:', error);
    return false;
  }
}

/**
 * Share search results
 * @param {Array} words - Words to share
 * @param {string} searchType - Type of search that was performed
 * @param {string} query - The search query
 * @returns {Promise<boolean>} - Success status
 */
export async function shareResults(words, searchType, query) {
  try {
    if (!words || words.length === 0) {
      return false;
    }
    
    // Format the words as a string
    const formattedWords = words.map(w => w.word).join(', ');
    
    // Create share text
    const shareText = `${searchType} search for "${query}" on wrdhelpr: ${formattedWords}`;
    
    // Use Web Share API if available
    if (navigator.share) {
      await navigator.share({
        title: 'wrdhelpr search results',
        text: shareText,
        url: window.location.href
      });
      return true;
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(shareText);
      return true;
    }
  } catch (error) {
    console.error('Error sharing results:', error);
    return false;
  }
}

/**
 * Copy search results to clipboard
 * @param {Array} words - Words to copy
 * @returns {Promise<boolean>} - Success status
 */
export async function copyResultsToClipboard(words) {
  try {
    if (!words || words.length === 0) {
      return false;
    }
    
    // Format the words as a string
    const formattedWords = words.map(w => w.word).join(', ');
    
    // Copy to clipboard
    await navigator.clipboard.writeText(formattedWords);
    return true;
  } catch (error) {
    console.error('Error copying results to clipboard:', error);
    return false;
  }
}

/**
 * Get the ID of the search input based on search type
 * @param {string} searchType - Type of search ('starts', 'contains', 'ends')
 * @returns {string} - ID of the search input element
 */
function getSearchInputId(searchType) {
  switch (searchType.toLowerCase()) {
    case 'starts':
      return 'startsWithInput';
    case 'ends':
      return 'endsWithInput';
    case 'contains':
    default:
      return 'containsInput';
  }
}