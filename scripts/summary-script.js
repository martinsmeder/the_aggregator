require("dotenv").config();
const fetch = require("node-fetch");
// const summarize = require("./huggingface");

const apiUrl = "https://rss-to-json-serverless-api.vercel.app/api?feedURL=";
const feedUrl = "https://news.mit.edu/topic/mitcomputers-rss.xml";

function parse(arr) {
  return arr.map((item) => ({
    title: item.title,
    url: item.link,
    content: item.content,
    published: item.published,
    image: item.media.content.url,
  }));
}

function getSingleFeed(url) {
  return fetch(url)
    .then((response) => response.json())
    .then((json) => parse(json.items))
    .catch((error) => console.error(error));
}

getSingleFeed(apiUrl + feedUrl).then((result) =>
  result.forEach((item) => console.log(item))
);

// getNewsData(apiUrl)
//   .then((result) =>
//     Promise.all(
//       result.map((item) =>
//         summarize({ inputs: item.content }).then((summary) => ({
//           content: summary,
//         }))
//       )
//     )
//   )
//   .then((summarized) =>
//     summarized.forEach((summary) =>
//       console.log(JSON.stringify(summary.content))
//     )
//   )
//   .catch((error) => console.error(error));
