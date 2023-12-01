require("dotenv").config();
const fetch = require("node-fetch");
const summarize = require("./huggingface");
const { testDb } = require("./firebase-test-cjs");
const firestore = require("./database-logic");
const rssFeeds = require("./rss");

const summaryScript = (() => {
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

  function getSingleFeed(url) {
    return fetch(url)
      .then((response) => response.json())
      .then((json) => transform(json.items))
      .then((transformed) =>
        transformed.filter(
          (item) => new Date(item.published) > rssFeeds.getOneMonthAgo()
        )
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

summaryScript.init(testDb);
