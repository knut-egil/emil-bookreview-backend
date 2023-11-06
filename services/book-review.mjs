const CACHE_TTL = process.env.CACHE_TTL || 1000 * 60 * 60 * 1 // 1-Hour cache time-to-live 
const cache = {
  bookreviews: {
    data: [],
    timestamp: null
  } 
}
function cacheData(key, data) {
  cache[key] = {
    data: data,
    timestamp: Date.now()
  };
}
function isCacheStale(key) {
  const timestamp = cache[key].timestamp;
  if (timestamp + CACHE_TTL < Date.now())
    return true;
  return false;
}


/**
 * Get book reviews from google script
 * @returns 
 */
async function getBookReviews(useCache = true) {
  try {
    const CACHE_KEY = "bookreviews";

    // Get cached data
    let bookReviews = cache[CACHE_KEY].data;

    // Check if data is stale
    if (isCacheStale(CACHE_KEY) || !useCache) {
      // Send HTTP request for å hente data
      const res = await fetch("https://script.google.com/macros/s/AKfycby7YloHJdUYF1y1IMzaDbTd8p13qiHEvTr9OctGlCZ8SIRAVhIpeI3GgqvgD0U1cJDO/callback", {
          "headers": {
          "accept": "*/*",
          "accept-language": "en-US,en;q=0.5",
          "cache-control": "no-cache",
          "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
          "pragma": "no-cache",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "x-same-domain": "1"
        },
        "body": "request=%5B%22getData%22%2C%22%5B%5D%22%2Cnull%2C%5B0%5D%2Cnull%2Cnull%2C1%2C0%5D",
        "method": "POST",
        "credentials": "omit"
      });

      // Les data fra respons, som tekst og fjern noen tegn fra starten
      const data = JSON.parse((await res.text()).slice(6));

      // Hent ut bok review dataen fra respons-data
      bookReviews = JSON.parse(data[0][1][1]);

      // Cache the data
      cacheData(CACHE_KEY, bookReviews);
    }

    // Return 
    return bookReviews;
  }
  catch(err) {
    console.error(err);
    return err;
  }
}

export default {
  getBookReviews
}