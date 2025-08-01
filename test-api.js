// Simple test to check if the Datamuse API is working
async function testAPI() {
  const testUrl = 'https://api.datamuse.com/words?sp=l*&md=d&max=10';
  console.log('Testing API with URL:', testUrl);
  
  try {
    const response = await fetch(testUrl);
    const data = await response.json();
    console.log('API Response:', data);
    console.log('Number of results:', data.length);
    if (data.length > 0) {
      console.log('First few results:', data.slice(0, 3));
    }
  } catch (error) {
    console.error('API Error:', error);
  }
}

testAPI();