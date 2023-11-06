/**
 * Get book reviews from google script
 * @returns 
 */
async function getBookReviews() {

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
    const bookReviews = JSON.parse(data[0][1][1]);
  
    return bookReviews;
}

export default {
  getBookReviews
}