require("dotenv").config();
const fetch = require("node-fetch");
const summarize = require("./huggingface");
const { db } = require("./firebase-cjs");
// const { testDb } = require("./firebase-test-cjs");
const firestore = require("./database-logic");
const miscHelpers = require("./utils");

const summaryScript = (() => {
  const apiUrl = "https://rss-to-json-serverless-api.vercel.app/api?feedURL=";
  const feedUrl = "https://news.mit.edu/topic/mitcomputers-rss.xml";

  function getSingleFeed(url) {
    return fetch(url)
      .then((response) => response.json())
      .then((json) => miscHelpers.parseSummaryData(json.items))
      .catch((error) => console.error(error));
  }

  function summarizeArray(articles) {
    // Create an array of promises for each article
    const promises = articles.map((article) =>
      // Call the summarize function to generate a summary for the article's content
      summarize({ inputs: article.content })
        // If the summarize function resolves successfully
        .then((response) => {
          // Create a copy of the article object to prevent mutation
          const updatedArticle = { ...article };
          // Assign the summary to the copied article object
          updatedArticle.summary = response[0].summary_text;
          // Return the updated article with the added summary
          return updatedArticle;
        })
        // If an error occurs during the summarization process
        .catch((error) => {
          // Log the error message for the failed summary
          console.error(`Error summarizing: ${error}`);
          // Return the original article to keep it unchanged
          return article;
        })
    );

    // Return a promise that resolves when all individual promises (summarizations) are settled
    return Promise.all(promises);
  }
  function getSummarizedFeeds(url) {
    return getSingleFeed(url)
      .then((feedData) => summarizeArray(feedData))
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
          return getSummarizedFeeds(apiUrl + feedUrl);
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
    queryAndDelete,
    addRssData,
    init,
  };
})();

summaryScript.init(db);

module.exports = summaryScript;
