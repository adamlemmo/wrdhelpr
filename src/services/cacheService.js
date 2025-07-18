/**
 * Cache Service
 * Manages local storage of search results for performance and offline use
 */

// Cache configuration
const CACHE_PREFIX = 'wrdhelpr_cache_';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Store search results in local storage
 * @param {string} searchType - Type of search ('starts', 'contains', 'ends')
 * @param {string} query - The search query
 * @param {Array} results - The search results to cache
 * @param {Array} letterOccurrences - Optional letter occurrence specifications
 * @returns {boolean} - Success status
 */
export function cacheResults(searchType, query, results, letterOccurrences = []) {
  try {
    if (!isLocalStorageAvailable()) {
      return false;
    }
    
    const key = generateCacheKey(searchType, query, letterOccurrences);
    const cacheEntry = {
      query,
      searchType,
      letterOccurrences,
      timestamp: Date.now(),
      expiry: Date.now() + CACHE_EXPIRY,
      results
    };
    
    localStorage.setItem(key, JSON.stringify(cacheEntry));
    return true;
  } catch (error) {
    console.error('Error caching results:', error);
    return false;
  }
}

/**
 * Retrieve cached search results
 * @param {string} searchType - Type of search ('starts', 'contains', 'ends')
 * @param {string} query - The search query
 * @param {Array} letterOccurrences - Optional letter occurrence specifications
 * @returns {Array|null} - Cached results or null if not found/expired
 */
export function getCachedResults(searchType, query, letterOccurrences = []) {
  try {
    if (!isLocalStorageAvailable()) {
      return null;
    }
    
    const key = generateCacheKey(searchType, query, letterOccurrences);
    const cachedData = localStorage.getItem(key);
    
    if (!cachedData) {
      return null;
    }
    
    const cacheEntry = JSON.parse(cachedData);
    
    // Check if cache has expired
    if (cacheEntry.expiry < Date.now()) {
      localStorage.removeItem(key);
      return null;
    }
    
    return cacheEntry.results;
  } catch (error) {
    console.error('Error retrieving cached results:', error);
    return null;
  }
}

/**
 * Clear all cached search results
 * @returns {boolean} - Success status
 */
export function clearCache() {
  try {
    if (!isLocalStorageAvailable()) {
      return false;
    }
    
    // Only clear items with our cache prefix
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(CACHE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
    
    return true;
  } catch (error) {
    console.error('Error clearing cache:', error);
    return false;
  }
}

/**
 * Check if local storage is available
 * @returns {boolean} - Whether local storage is available
 */
export function isLocalStorageAvailable() {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Generate a cache key based on search parameters
 * @param {string} searchType - Type of search
 * @param {string} query - Search query
 * @param {Array} letterOccurrences - Letter occurrence specifications
 * @returns {string} - Cache key
 */
function generateCacheKey(searchType, query, letterOccurrences) {
  // Sort letter occurrences to ensure consistent keys
  const sortedOccurrences = [...letterOccurrences].sort((a, b) => 
    a.letter.localeCompare(b.letter)
  );
  
  // Create a string representation of letter occurrences
  const occurrencesStr = sortedOccurrences.length > 0
    ? '-' + sortedOccurrences.map(o => `${o.letter}${o.count}`).join('')
    : '';
  
  return `${CACHE_PREFIX}${searchType}_${query.toLowerCase()}${occurrencesStr}`;
}

/**
 * Clean up expired cache entries
 * @returns {number} - Number of entries removed
 */
export function cleanExpiredCache() {
  try {
    if (!isLocalStorageAvailable()) {
      return 0;
    }
    
    let removedCount = 0;
    const now = Date.now();
    
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(CACHE_PREFIX)) {
        try {
          const cacheEntry = JSON.parse(localStorage.getItem(key));
          if (cacheEntry.expiry < now) {
            localStorage.removeItem(key);
            removedCount++;
          }
        } catch (e) {
          // If entry is corrupted, remove it
          localStorage.removeItem(key);
          removedCount++;
        }
      }
    });
    
    return removedCount;
  } catch (error) {
    console.error('Error cleaning expired cache:', error);
    return 0;
  }
}