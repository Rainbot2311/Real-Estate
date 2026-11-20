const http = require('http');
const fs = require('fs');
const path = require('path');

function testEndpoint(urlPath) {
  return new Promise((resolve) => {
    http.get('http://localhost:3000' + urlPath, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ status: res.statusCode, length: data.length, data });
      });
    }).on('error', (err) => {
      resolve({ status: 500, error: err.message });
    });
  });
}

async function runTests() {
  console.log('--- Testing Homepage ---');
  const home = await testEndpoint('/');
  console.log(`GET / : Status ${home.status}, Size ${home.length} bytes`);

  if (home.status !== 200) {
    console.error('Failed to load homepage!');
    process.exit(1);
  }

  // Parse all assets referenced in index.html
  const assetRegex = /(?:src|href)="([^"]+)"/g;
  let match;
  const assets = new Set();
  while ((match = assetRegex.exec(home.data)) !== null) {
    const url = match[1];
    if (url.startsWith('assets/') || url === 'styles.css' || url === 'app.js') {
      assets.add('/' + url);
    }
  }

  console.log(`--- Testing ${assets.size} Internal Assets ---`);
  let hasError = false;

  for (const asset of assets) {
    const res = await testEndpoint(asset);
    if (res.status === 200) {
      console.log(`[PASS] ${asset} (${res.length} bytes)`);
    } else {
      console.error(`[FAIL] ${asset} - Status ${res.status}`);
      hasError = true;
    }
  }

  if (hasError) {
    console.error('Some assets failed to load!');
    process.exit(1);
  } else {
    console.log('--- ALL ASSETS PASSED VERIFICATION (STATUS 200) ---');
  }
}

runTests();
