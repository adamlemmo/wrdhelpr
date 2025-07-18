import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  searchWordsByPrefix, 
  searchWordsByContains, 
  searchWordsByEnding,
  getWordDefinition
} from '../src/services/dictionaryService.js';

// Mock fetch
global.fetch = vi.fn();

describe('Dictionary Service', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  describe('searchWordsByPrefix', () => {
    it('should fetch words starting with the given prefix', async () => {
      // Mock response
      const mockResponse = [
        { word: 'apple', defs: ['n. a fruit'] },
        { word: 'application', defs: ['n. a program'] }
      ];
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });
      
      const result = await searchWordsByPrefix('app');
      
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('sp=app*'));
      expect(result).toHaveLength(2);
      expect(result[0].word).toBe('apple');
      expect(result[1].word).toBe('application');
    });
    
    it('should filter results by letter occurrences', async () => {
      // Mock response with words having different letter occurrences
      const mockResponse = [
        { word: 'apple', defs: ['n. a fruit'] },  // has one 'p'
        { word: 'happy', defs: ['adj. feeling joy'] }  // has two 'p's
      ];
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });
      
      // Search for words with exactly two 'p's
      const letterOccurrences = [{ letter: 'p', count: 2 }];
      const result = await searchWordsByPrefix('ha', letterOccurrences);
      
      expect(result).toHaveLength(1);
      expect(result[0].word).toBe('happy');
    });
  });

  describe('searchWordsByContains', () => {
    it('should fetch words containing the given letters', async () => {
      // Mock response
      const mockResponse = [
        { word: 'apple', defs: ['n. a fruit'] },
        { word: 'application', defs: ['n. a program'] }
      ];
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });
      
      const result = await searchWordsByContains('pl');
      
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('sp=*pl*'));
      expect(result).toHaveLength(2);
    });
  });

  describe('searchWordsByEnding', () => {
    it('should fetch words ending with the given suffix', async () => {
      // Mock response
      const mockResponse = [
        { word: 'apple', defs: ['n. a fruit'] },
        { word: 'pineapple', defs: ['n. a tropical fruit'] }
      ];
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });
      
      const result = await searchWordsByEnding('le');
      
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('sp=*le'));
      expect(result).toHaveLength(2);
      expect(result[0].word).toBe('apple'); // Should be sorted alphabetically
      expect(result[1].word).toBe('pineapple');
    });
  });

  describe('getWordDefinition', () => {
    it('should fetch detailed definition for a word', async () => {
      // Mock response for Free Dictionary API
      const mockResponse = [{
        word: 'apple',
        phonetics: [{ text: '/ˈæpəl/' }],
        meanings: [{
          partOfSpeech: 'noun',
          definitions: [
            { definition: 'A fruit from an apple tree', example: 'I ate an apple' }
          ]
        }]
      }];
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });
      
      const result = await getWordDefinition('apple');
      
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('apple'));
      expect(result.word).toBe('apple');
      expect(result.phonetics).toBe('/ˈæpəl/');
      expect(result.meanings).toHaveLength(1);
      expect(result.examples).toContain('I ate an apple');
    });
  });
});