require("dotenv").config();
const fetch = require("node-fetch");
const summarize = require("./huggingface");

const apiUrl = "https://rss-to-json-serverless-api.vercel.app/api?feedURL=";
const feedUrl = "https://news.mit.edu/topic/mitcomputers-rss.xml";

function transform(arr) {
  return arr.map((item) => ({
    title: item.title,
    url: item.link,
    content: item.content,
    published: item.published,
    image: item.media.content.url,
    summary: null,
  }));
}

function getOneMonthAgo() {
  const today = new Date();
  const oneMonthAgo = new Date(
    today.getFullYear(),
    today.getMonth() - 1,
    today.getDate()
  );
  return oneMonthAgo;
}

function getSingleFeed(url) {
  return fetch(url)
    .then((response) => response.json())
    .then((json) => transform(json.items))
    .then((transformed) =>
      transformed.filter((item) => new Date(item.published) > getOneMonthAgo())
    )
    .catch((error) => console.error(error));
}

function summarizeArray(articles) {
  const promises = articles.map((article) =>
    summarize({ inputs: article.content })
      .then((response) => {
        const updatedArticle = article;
        updatedArticle.summary = response;
        return updatedArticle;
      })
      .catch((error) => {
        console.error(`Error summarizing: ${error}`);
        return article;
      })
  );

  return Promise.all(promises);
}

getSingleFeed(apiUrl + feedUrl)
  .then((result) => summarizeArray(result))
  .then((summarized) =>
    summarized.forEach((item) => console.log(JSON.stringify(item.summary)))
  )
  .catch((error) => console.error(error));

// getSingleFeed(apiUrl + feedUrl)
//   .then((result) => summarize({ inputs: result[5].content }))
//   .then((summary) => console.log(JSON.stringify(summary)));

// 1. Filter out anything older than 1month
// 2. Summarize the rest

// getSingleFeed(apiUrl + feedUrl)
//   .then((result) => summarize({ inputs: result[1].content }))
//   .then((summary) => console.log(JSON.stringify(summary)));

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
