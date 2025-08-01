# wrdhelpr V2
Word Helper app for helping with word games like Squardle, Wordle etc.

## Features

### Core Functionality
- **Missing Letters Calculator**: Enter letters from your game to find which letters are missing from the alphabet
- **Word Search**: Find words that start with, contain, or end with specific letters
- **Word Length Filtering**: Specify exact word length or search any length
- **Smart Input Validation**: Search inputs are automatically validated to only use available letters
- **Copy to Clipboard**: Easy copying of results for use in games

### Technical Features
- **API Integration**: Uses Datamuse API for comprehensive word searches
- **Caching**: Local storage caching for improved performance
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Validation**: Instant feedback on input validity

## Usage

1. **Enter Game Letters**: Type the letters available in your word game into the main input field
2. **View Missing Letters**: The excluded letters are automatically calculated and displayed
3. **Refine Search** (Optional):
   - **Starts**: Enter letters the word should start with
   - **Contains**: Enter letters the word must contain
   - **Ends**: Enter letters the word should end with
   - **Length**: Set specific word length or choose "Any"
4. **Search**: Click the search button to find matching words
5. **Copy Results**: Use the copy button to copy letters or words to clipboard

## Development

### Running the App
```bash
npm run dev    # Start development server
npm run build  # Build for production
npm run deploy # Deploy to GitHub Pages
```

### Testing
```bash
npm test       # Run tests
npm run test:ui # Run tests with UI
```

## Project Structure

```
wrdhelpr/
├── src/
│   ├── main.js           # Main application logic
│   ├── wordSearch.js     # Word search functionality
│   ├── style.css         # Application styles
│   └── services/         # API and utility services
│       ├── dictionaryService.js  # Datamuse API integration
│       ├── cacheService.js       # Local storage caching
│       └── integrationService.js # Cross-feature utilities
├── tests/                # Test files
├── .kiro/specs/         # Feature specifications
└── index.html           # Main HTML file
```
