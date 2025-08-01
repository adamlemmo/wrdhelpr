// Test the letter filtering logic specifically
function testLetterLogic() {
  const userInput = "LOOKB";
  const testWords = ["LOOK", "LOB", "LOOM", "LURID", "L"];
  
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
    
    let canMakeWord = true;
    for (const char in wordFreq) {
      if (!userInputFreq[char] || wordFreq[char] > userInputFreq[char]) {
        canMakeWord = false;
        break;
      }
    }
    
    console.log(`"${word}": ${canMakeWord ? 'CAN MAKE' : 'CANNOT MAKE'} - needs:`, wordFreq);
  });
}

// Expected results:
// LOOK: CAN MAKE (needs L:1, O:2, K:1 - all available)
// LOB: CAN MAKE (needs L:1, O:1, B:1 - all available)  
// LOOM: CANNOT MAKE (needs M:1 - not available)
// LURID: CANNOT MAKE (needs U:1, R:1, I:1, D:1 - not available)
// L: CAN MAKE (needs L:1 - available)

testLetterLogic();