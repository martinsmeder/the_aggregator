const { db } = require("./firebase-cjs");
const rssFeeds = require("./rss");
const firestore = require("./database-logic");

const feedScript = (() => {
  function queryAndDelete(database) {
    return firestore
      .queryItems(database, "all-items", "asc", 1000)
      .then((querySnapshot) => firestore.deleteOldData(querySnapshot))
      .then(() => "Old data successfully deleted.")
      .catch((error) => console.error(`Error: ${error}`));
  }

  function addRssData(database) {
    return (
      firestore
        .queryItems(database, "all-items", "desc", 4000)
        .then((querySnapshot) => {
          firestore.setExistingIds(querySnapshot);
          return rssFeeds.getRssData(rssFeeds.urls);
        })
        .then((processedData) =>
          firestore.addToFirestore(database, "feeds", processedData)
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

feedScript.init(db);

module.exports = firestore;
