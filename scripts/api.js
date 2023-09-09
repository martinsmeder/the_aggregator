// require("dotenv").config();
// const fetch = require("node-fetch");

// Reuters:
// Categories: Tech, business, science, world
// Create one request for each page
// Get data from successfull requests and error "no data on page" if empty
// Combine into one array
// Get the categories i want using filter
// Get the data i want using map
// Make sure I'm not getting any old data

// const apiKey = process.env.NEWS_API_KEY;
const apiUrl = "https://newsapi.org/v2/";
const source = "reuters";
const apiKey = "???";

function fetchPage(page) {
  return fetch(
    `${apiUrl}everything?sources=${source}&page=${page}&apiKey=${apiKey}`
  ).then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  });
}

function fetchAllPages() {
  let page = 1;
  const results = [];

  function fetchNextPage() {
    return fetchPage(page).then((data) => {
      if (data.articles.length === 0) {
        return results;
      }
      results.push(data);
      page++;
      return fetchNextPage();
    });
  }

  return fetchNextPage();
}

fetchAllPages()
  .then((dataArray) => {
    console.log("All pages fetched:", dataArray);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
