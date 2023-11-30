require("dotenv").config();
const fetch = require("node-fetch");
const summarize = require("./huggingface");
const { testDb } = require("./firebase-test-cjs");
const firestore = require("./database-logic");

const apiUrl = "https://rss-to-json-serverless-api.vercel.app/api?feedURL=";
const feedUrl = "https://news.mit.edu/topic/mitcomputers-rss.xml";

function transform(arr) {
  return arr.map((item) => {
    const date = new Date(item.published);
    return {
      title: item.title,
      url: item.link,
      content: item.content,
      rssId: item.title + item.url,
      published: date.toLocaleString(),
      timestamp: date.getTime(),
      image: item.media.content.url,
      summary: null,
    };
  });
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
        updatedArticle.summary = response[0].summary_text;
        return updatedArticle;
      })
      .catch((error) => {
        console.error(`Error summarizing: ${error}`);
        return article;
      })
  );

  return Promise.all(promises);
}

function getSummarizedFeeds(url) {
  return getSingleFeed(url)
    .then((feedData) => summarizeArray(feedData))
    .catch((error) => console.error(error));
}

firestore
  .queryItems(testDb, "summaries", "desc", 100)
  .then((querySnapshot) => {
    firestore.setExistingIds(querySnapshot);
    return getSummarizedFeeds(apiUrl + feedUrl);
  })
  .then((feedData) =>
    firestore.addToFirestore(testDb, "summaries", feedData).then(() => {
      console.log("Script executed successfully.");
    })
  )
  // eslint-disable-next-line no-return-assign
  .then(() => (firestore.existingIds.length = 0))
  .catch((error) => console.error(error))
  .finally(() => process.exit(0));

// ---
// ---
// 3. Remove old items
// 4. Everything above when running script
// 5. Tests
