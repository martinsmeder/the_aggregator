const {
  addDoc,
  collection,
  deleteDoc,
  getDocs,
  limit,
  orderBy,
  query,
} = require("firebase/firestore");
// const { db } = require("./firebase-cjs");
const rssFeeds = require("./rss");

const firestore = (() => {
  const existingIds = [];

  function setExistingIds(querySnapshot) {
    querySnapshot.docs.forEach((doc) => existingIds.push(doc.data().rssId));
  }

  function queryItems(database, order, itemLimit) {
    const collectionRef = collection(database, "all-items");
    const q = query(
      collectionRef,
      orderBy("timestamp", order),
      limit(itemLimit)
    );

    return getDocs(q);
  }

  function deleteOldData(querySnapshot) {
    const oneYearAgo = rssFeeds.getOneYearAgo();

    const deletionPromises = querySnapshot.docs
      .filter((doc) => doc.data().timestamp < oneYearAgo.getTime())
      .map((doc) =>
        deleteDoc(doc.ref).catch((error) =>
          console.error(`Error deleting ${doc.ref.path}:`, error)
        )
      );

    return Promise.all(deletionPromises);
  }

  function addToFirestore(database, processedData) {
    const writePromises = [];

    processedData.forEach((item) => {
      if (!existingIds.includes(item.rssId)) {
        const promise = addDoc(collection(database, "all-items"), item).catch(
          (error) => console.log(`Error writing ${item.rssId}: ${error}`)
        );
        writePromises.push(promise);
      }
    });

    return Promise.all(writePromises);
  }

  function clearFirestore(querySnapshot) {
    const deletionPromises = querySnapshot.docs.map((doc) =>
      deleteDoc(doc.ref)
    );
    return Promise.all(deletionPromises);
  }

  return {
    existingIds,
    setExistingIds,
    queryItems,
    deleteOldData,
    addToFirestore,
    clearFirestore,
  };
})();

const scriptRunner = (() => {
  function queryAndDelete(database) {
    return firestore
      .queryItems(database, "asc", 500)
      .then((querySnapshot) => firestore.deleteOldData(querySnapshot))
      .then(() => "Old data successfully deleted.")
      .catch((error) => console.error(`Error: ${error}`));
  }

  function addRssData(database) {
    return firestore
      .queryItems(database, "desc", 500)
      .then((querySnapshot) => {
        firestore.setExistingIds(querySnapshot);
        return rssFeeds.getRssData(rssFeeds.urls);
      })
      .then((processedData) =>
        firestore.addToFirestore(database, processedData)
      )
      .then(() => (firestore.existingIds.length = 0))
      .then(() => "New data successfully added.")
      .catch((error) => console.error(`Error: ${error}`));
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

// scriptRunner.init(db);

module.exports = { scriptRunner, firestore };
