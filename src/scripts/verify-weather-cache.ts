async function main() {
  const url = 'http://localhost:3000/api/weather?city=Shanghai';
  console.log(`Fetching ${url}...`);

  // Simple retry logic to wait for server
  let response;
  for (let i = 0; i < 10; i++) {
    try {
      response = await fetch(url);
      if (response.status !== 503) break;
    } catch {
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  if (!response) {
      console.error('Failed to connect to server');
      process.exit(1);
  }

  console.log(`Response status: ${response.status}`);

  const cacheControl = response.headers.get('cache-control');
  console.log(`Cache-Control header: ${cacheControl}`);

  if (!cacheControl) {
    console.error('FAIL: Cache-Control header is missing');
    process.exit(1);
  } else {
    console.log('Cache-Control header is present');
    const expectedDirectives = ['public', 'max-age=3600', 's-maxage=3600', 'stale-while-revalidate=600'];
    const allDirectivesPresent = expectedDirectives.every(directive => cacheControl.includes(directive));

    if (allDirectivesPresent) {
      console.log('PASS: Cache-Control header is correct');
    } else {
      console.error(`FAIL: Cache-Control header is incorrect. Expected it to contain: ${expectedDirectives.join(', ')}`);
      process.exit(1);
    }
  }
}

main();
