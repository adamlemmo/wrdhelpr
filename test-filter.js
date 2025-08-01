// Test the letter filtering logic
function testLetterFilter() {
  const userInput = "LOOKB";
  const testWords = ["LOOK", "BOOK", "LOB", "LURID", "LANGUID", "L"];
  
  const userInputFreq = {};
  for (const char of userInput.toUpperCase()) {
    userInputFreq[char] = (userInputFreq[char] || 0) + 1;
  }
  
  console.log('Available letters:', userInputFreq);
  
  testWords.forEach(word => {
    const wordFreq = {};
    for (const char of word.toUpperCase()) {
      wordFreq[char] = (wordFreq[char] || 0) + 1;
    }
    
    let canMake = true;
    for (const char in wordFreq) {
      if (!userInputFreq[char] || wordFreq[char] > userInputFreq[char]) {
        canMake = false;
        break;
      }
    }
    
    console.log(`"${word}": ${canMake ? 'CAN MAKE' : 'CANNOT MAKE'} - needs:`, wordFreq);
  });
}

testLetterFilter();