require("dotenv").config();
const fetch = require("node-fetch");
const summarize = require("./huggingface");
const { db } = require("./firebase-cjs");
// const { testDb } = require("./firebase-test-cjs");
const firestore = require("./database-logic");
const miscHelpers = require("./utils");

const summaryScript = (() => {
  const apiUrl = "https://api.rss2json.com/v1/api.json";
  const feedUrl = "https://news.mit.edu/topic/mitmachine-learning-rss.xml";
  const apiKey = process.env.RSS_API_KEY;
  const fullUrl = `${apiUrl}?rss_url=${feedUrl}&api_key=${apiKey}&count=1000`;

  function getSingleFeed(url) {
    return fetch(url)
      .then((response) => response.json())
      .then((json) => miscHelpers.parseSummaryData(json.items))
      .catch((error) => console.error(error));
  }

  function summarizeArray(articles, maxAttempts = 5) {
    const processArticle = (article, attempt = 1) =>
      summarize({ inputs: article.content })
        .then((response) => {
          // Update article with newly created summary
          const updatedArticle = { ...article };
          updatedArticle.summary = response[0].summary_text;
          return updatedArticle;
        })
        .catch((error) => {
          console.error(`Error summarizing: ${error}`);
          // Keep calling processArticle until either the summarization
          // succeeds or maxAttempts is reached
          if (attempt < maxAttempts) {
            console.log(
              `Retrying summarization for article (${
                attempt + 1
              }/${maxAttempts})`
            );
            return processArticle(article, attempt + 1);
          }
          console.error(
            `Exceeded maximum attempts (${maxAttempts}) for this article.`
          );
          return article;
        });

    // Create an array of promises by calling processArticle on each article
    const promises = articles.map((article) => processArticle(article));

    return Promise.all(promises);
  }

  function getSummarizedFeeds(url) {
    return getSingleFeed(url)
      .then((feedData) => summarizeArray(feedData, 5))
      .catch((error) => console.error(error));
  }

  function queryAndDelete(database) {
    return firestore
      .queryItems(database, "summaries", "asc", 500)
      .then((querySnapshot) => firestore.deleteOlderThanOneMonth(querySnapshot))
      .then(() => "Old data successfully deleted.")
      .catch((error) => console.error(`Error: ${error}`));
  }

  function addRssData(database) {
    return (
      firestore
        .queryItems(database, "summaries", "desc", 500)
        .then((querySnapshot) => {
          firestore.setExistingIds(querySnapshot);
          return getSummarizedFeeds(fullUrl);
        })
        .then((processedData) =>
          firestore.addToFirestore(database, "summaries", processedData)
        )
        // eslint-disable-next-line no-return-assign
        .then(() => (firestore.existingIds.length = 0))
        .then(() => "New data successfully added.")
        .catch((error) => console.error(`Error: ${error}`))
    );
  }

  function init(database) {
    queryAndDelete(database)
      .then((result) => {
        console.log(result);
        return addRssData(database);
      })
      .then((result) => {
        console.log(result);
        console.log("Script executed successfully.");
      })
      .catch((error) => console.error(`Error: ${error}`))
      .finally(() => process.exit(0)); // Terminate script
  }

  return {
    getSingleFeed,
    queryAndDelete,
    addRssData,
    init,
  };
})();

summaryScript.init(db);

module.exports = summaryScript;
