// require("dotenv").config();
// const fetch = require("node-fetch");

// Reuters:
// Categories: Tech, business, science, world
// ---
// ---
// ---
// ---
// ---
// I'm mostly getting business from reuters, no science, new approach needed
// Make sure I'm not getting any old data
// Make sure I'm not getting any duplicates

// const apiKey = process.env.NEWS_API_KEY;
const apiUrl = "https://newsapi.org/v2/";
const source = "reuters";
const apiKey = "???";

function fetchPage(page) {
  return fetch(
    `${apiUrl}everything?sources=${source}&page=${page}&apiKey=${apiKey}`
  ).then((response) => {
    if (!response.ok) console.error(`Http error: ${response.status}`);
    return response.json();
  });
}

function parse(dataArray) {
  const parsed = dataArray
    .flat()
    .map((item) => {
      const date = new Date(item.publishedAt);
      if (item.url.includes("/science/")) item.category = "science";
      else if (item.url.includes("/technology/")) item.category = "technology";
      else if (item.url.includes("/business/")) item.category = "business";
      else if (item.url.includes("/world/")) item.category = "world";
      else item.category = "other";
      return {
        date: date.toLocaleString(),
        title: item.title,
        link: item.url,
        description: item.description || "No description available",
        source: item.source.name,
        category: item.category,
        content: item.content,
        timestamp: new Date(item.publishedAt).getTime(),
      };
    })
    .filter((item) => {
      if (
        item.category === "science" ||
        item.category === "technology" ||
        item.category === "business" ||
        item.category === "world"
      )
        return item;
    });

  return parsed;
}

function fetchAllPages() {
  let page = 1;
  const results = [];

  function fetchNextPage() {
    return fetchPage(page).then((data) => {
      // If no more items in array, stop calling and return results
      if (data.articles.length === 0) return results;
      results.push(data.articles);
      page++;
      // Recursively call itself until no more items in array
      return fetchNextPage();
    });
  }
  return fetchNextPage();
}

// fetchAllPages()
//   .then((dataArray) => parse(dataArray))
//   .then((parsed) => parsed.forEach((item) => console.log(item)))
//   .catch((error) => console.error(error));
