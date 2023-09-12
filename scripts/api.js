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

// .map((item) => {
//     const date = new Date(item.published);
//     return {
//       date: date.toLocaleString(),
//       title: item.title,
//       link: item.link,
//       description: item.description || "No description available",
//       source: array.title,
//       category: category,
//       timestamp: new Date(item.published).getTime(),
//     };
//   })

function parse(dataArray) {
  const parsed = dataArray.flat().map((item) => {
    const date = new Date(item.publishedAt);
    return {
      date: date.toLocaleString(),
      title: item.title,
      link: item.url,
      description: item.description || "No description available",
      source: item.source.name,
      category: "?",
      content: item.content,
      timestamp: new Date(item.publishedAt).getTime(),
    };
  });

  return parsed;
}

// author: "Reuters"
// content: "BERLIN, Aug 11 (Reuters) - UBS (UBSG.S) said in a memo to employees seen by Reuters on Friday that it would provide information on some more milestones it has reached in its merger with Credit Suisse… [+461 chars]"
// description: "UBS <a href=\"https://www.reuters.com/markets/companies/UBSG.S\" target=\"_blank\">(UBSG.S)</a> said in a memo to employees seen by Reuters on Friday that it would provide information on some more milestones it has reached in its merger with Credit Suisse as part…"
// publishedAt: "2023-08-11T05:57:38Z"
// source: {id: 'reuters', name: 'Reuters'}
// title: "UBS tells employees: more milestones in CS merger to be announced Aug 31"
// url: "https://www.reuters.com/business/finance/ubs-tells-employees-more-milestones-cs-merger-be-announced-aug-31-2023-08-11/"
// urlToImage: "https://www.reuters.com/resizer/TXIBCL2x67TpGxKogk3et6OEqQ4=/1200x628/smart/filters:quality(80)/cloudfront-us-east-2.images.arcpublishing.com/reuters/ARX2KBX66ZPXRMGHYY7YIYG64U.jpg"

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
