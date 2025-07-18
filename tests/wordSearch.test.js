import { describe, it, expect, vi, beforeEach } from 'vitest';
import { initWordSearch } from '../src/wordSearch.js';
import * as dictionaryService from '../src/services/dictionaryService.js';
import * as cacheService from '../src/services/cacheService.js';

// Mock the services
vi.mock('../src/services/dictionaryService.js');
vi.mock('../src/services/cacheService.js');

describe('Word Search Feature', () => {
  // Mock DOM elements
  beforeEach(() => {
    // Reset mocks
    vi.resetAllMocks();
    
    // Mock DOM elements
    document.body.innerHTML = `
      <div id="featureToggle">
        <button type="button" id="toggleWordSearch" class="toggle-btn">🔍 Word Search</button>
      </div>
      <div id="wordSearchContainer" style="display: none;">
        <div id="searchTabs">
          <button type="button" class="tab-btn active" data-search-type="starts">Starts With</button>
          <button type="button" class="tab-btn" data-search-type="contains">Contains</button>
          <button type="button" class="tab-btn" data-search-type="ends">Ends With</button>
        </div>
        <div id="searchForms">
          <form id="startsWithForm" class="search-form active">
            <input type="text" id="startsWithInput" class="search-input">
            <div id="startsWithOccurrences" class="occurrences-container"></div>
            <button type="submit" class="search-btn">Search</button>
          </form>
          <form id="containsForm" class="search-form">
            <input type="text" id="containsInput" class="search-input">
            <div id="containsOccurrences" class="occurrences-container"></div>
            <button type="submit" class="search-btn">Search</button>
          </form>
          <form id="endsWithForm" class="search-form">
            <input type="text" id="endsWithInput" class="search-input">
            <div id="endsWithOccurrences" class="occurrences-container"></div>
            <button type="submit" class="search-btn">Search</button>
          </form>
        </div>
        <div id="searchResults" style="display: none;">
          <div id="resultsHeader">
            <h3 id="resultsTitle">Search Results</h3>
            <button type="button" id="copySearchResults" class="copy-results-btn">Copy All</button>
          </div>
          <div id="loadingIndicator" style="display: none;"></div>
          <div id="wordsList"></div>
          <div id="noResults" style="display: none;"></div>
        </div>
      </div>
      <div id="toast"></div>
    `;
    
    // Mock dictionary service methods
    dictionaryService.searchWordsByPrefix.mockResolvedValue([
      { word: 'apple', definition: 'A fruit', partOfSpeech: 'noun' },
      { word: 'application', definition: 'A program', partOfSpeech: 'noun' }
    ]);
    
    dictionaryService.withRetry.mockImplementation((fn, args) => fn(...args));
    
    // Mock cache service methods
    cacheService.getCachedResults.mockReturnValue(null);
    cacheService.cacheResults.mockReturnValue(true);
    cacheService.cleanExpiredCache.mockReturnValue(0);
  });
  
  describe('Feature Toggle', () => {
    it('should toggle word search container visibility', () => {
      // Initialize the word search feature
      initWordSearch();
      
      // Get elements
      const toggleBtn = document.getElementById('toggleWordSearch');
      const container = document.getElementById('wordSearchContainer');
      
      // Initial state
      expect(container.style.display).toBe('none');
      
      // Click toggle button
      toggleBtn.click();
      
      // Container should be visible
      expect(container.style.display).toBe('block');
      expect(toggleBtn.textContent).toContain('Close');
      
      // Click toggle button again
      toggleBtn.click();
      
      // Container should be hidden
      expect(container.style.display).toBe('none');
      expect(toggleBtn.textContent).toContain('Word Search');
    });
  });
  
  describe('Search Tabs', () => {
    it('should switch between search forms', () => {
      // Initialize the word search feature
      initWordSearch();
      
      // Get elements
      const tabButtons = document.querySelectorAll('.tab-btn');
      const searchForms = document.querySelectorAll('.search-form');
      
      // Initial state - "Starts With" should be active
      expect(tabButtons[0].classList.contains('active')).toBe(true);
      expect(searchForms[0].classList.contains('active')).toBe(true);
      
      // Click "Contains" tab
      tabButtons[1].click();
      
      // "Contains" form should be active
      expect(tabButtons[0].classList.contains('active')).toBe(false);
      expect(tabButtons[1].classList.contains('active')).toBe(true);
      expect(searchForms[0].classList.contains('active')).toBe(false);
      expect(searchForms[1].classList.contains('active')).toBe(true);
    });
  });
  
  describe('Starts With Search', () => {
    it('should search for words starting with given letters', async () => {
      // Initialize the word search feature
      initWordSearch();
      
      // Get elements
      const input = document.getElementById('startsWithInput');
      const form = document.getElementById('startsWithForm');
      const results = document.getElementById('searchResults');
      const wordsList = document.getElementById('wordsList');
      
      // Enter search query
      input.value = 'app';
      
      // Submit the form
      const submitEvent = new Event('submit');
      form.dispatchEvent(submitEvent);
      
      // Wait for async operations
      await vi.waitFor(() => {
        expect(dictionaryService.searchWordsByPrefix).toHaveBeenCalledWith('app', []);
      });
      
      // Results should be displayed
      expect(results.style.display).not.toBe('none');
      
      // Wait for DOM updates
      await vi.waitFor(() => {
        expect(wordsList.children.length).toBe(2);
      });
      
      // Check that results are rendered correctly
      expect(wordsList.innerHTML).toContain('apple');
      expect(wordsList.innerHTML).toContain('application');
    });
  });
});