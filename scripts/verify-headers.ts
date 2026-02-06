async function verifyHeaders() {
  const url = 'http://localhost:3000';
  const maxRetries = 10;
  const retryDelay = 2000;

  console.log(`Checking headers for ${url}...`);

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url);
      const headers = response.headers;

      const expectedHeaders = {
        'x-dns-prefetch-control': 'on',
        'strict-transport-security': 'max-age=63072000; includeSubDomains; preload',
        'x-frame-options': 'SAMEORIGIN',
        'x-content-type-options': 'nosniff',
        'referrer-policy': 'origin-when-cross-origin',
        'permissions-policy': 'camera=(), microphone=(), geolocation=(), browsing-topics=()'
      };

      let allPassed = true;

      for (const [header, expectedValue] of Object.entries(expectedHeaders)) {
        const actualValue = headers.get(header);
        // Compare loosely or strictly? Strictly for now.
        // Note: header names in fetch API are case-insensitive, but when accessing we use lowercase.
        if (actualValue === expectedValue) {
          console.log(`✅ ${header}: ${actualValue}`);
        } else {
          console.log(`❌ ${header}: expected "${expectedValue}", got "${actualValue || 'MISSING'}"`);
          allPassed = false;
        }
      }

      if (allPassed) {
        console.log('\nAll security headers verified successfully! 🎉');
        process.exit(0);
      } else {
        console.log('\nSome security headers are missing or incorrect.');
        process.exit(1);
      }

    } catch (error) {
        if (i === maxRetries - 1) {
             console.error('Error fetching URL after retries:', error);
             process.exit(1);
        }
        console.log(`Server not ready, retrying in ${retryDelay/1000}s...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }
}

verifyHeaders();
