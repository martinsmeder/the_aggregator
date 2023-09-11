// require("dotenv").config();
// const fetch = require("node-fetch");

// Reuters:
// Categories: Tech, business, science, world
// ---
// ---
// Combine into one array
// Get the categories i want using filter
// Get the data i want using map
// Make sure I'm not getting any old data

// const apiKey = process.env.NEWS_API_KEY;
// const apiUrl = "https://newsapi.org/v2/";
// const source = "reuters";
// const apiKey = "???";

// function fetchPage(page) {
//   return fetch(
//     `${apiUrl}everything?sources=${source}&page=${page}&apiKey=${apiKey}`
//   ).then((response) => {
//     if (!response.ok) console.error(`Http error: ${response.status}`);
//     return response.json();
//   });
// }

// function fetchAllPages() {
//   let page = 1;
//   const results = [];

//   function fetchNextPage() {
//     return fetchPage(page).then((data) => {
//       // If no more items in array, stop calling and return results
//       if (data.articles.length === 0) return results;
//       results.push(data.articles);
//       page++;
//       // Recursively call itself until no more items in array
//       return fetchNextPage();
//     });
//   }
//   return fetchNextPage();
// }

// fetchAllPages()
//   .then((dataArray) => console.log(dataArray))
//   .catch((error) => console.error(error));

// ========================

// function parse(dataArray) {
//   const parsed = dataArray
//     .flat()
//     .filter((item) => item.id <= 10)
//     .map((item) => item.email);

//   return parsed;
// }

// // Call fetchAllPages, which returns a promise
// // When the promise is resolved, log the resulting array to the console
// fetchAllPages()
//   .then((dataArray) => parse(dataArray))
//   .then((parsed) => console.log(parsed))
//   .catch((error) => console.error(error));
