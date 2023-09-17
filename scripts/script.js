const {
  addDoc,
  collection,
  deleteDoc,
  getDocs,
  limit,
  orderBy,
  query,
} = require("firebase/firestore");
const { db } = require("./firebase-cjs");
const rssFeeds = require("./rss");

// 1. Change to use of ID's instead
// 2. Check other things to change
// 3. Make query into 1000
// 4. Delete data from database
// 5. Try the entire script
// 6. Check that duplication avoidance and automatic removal works
// 7. Simple UI check with DOM methods
// 8. Proceed with objects

const firestore = (() => {
  const existingTitles = [];

  function queryItems(order, itemLimit) {
    const collectionRef = collection(db, "all-items");
    const q = query(
      collectionRef,
      orderBy("timestamp", order),
      limit(itemLimit)
    );

    return getDocs(q);
  }

  function deleteOldData(querySnapshot) {
    const oneYearAgo = rss.getOneYearAgo();

    const deletionPromises = querySnapshot.docs
      .filter((doc) => doc.data().timestamp < oneYearAgo.getTime())
      .map((doc) =>
        deleteDoc(doc.ref).catch((error) =>
          console.error(`Error deleting ${doc.ref.path}:`, error)
        )
      );

    return Promise.all(deletionPromises);
  }

  function addToFirestore(processedData) {
    const writePromises = [];

    processedData.forEach((item) => {
      if (!existingTitles.includes(item.title)) {
        const promise = addDoc(collection(db, "all-items"), item).catch(
          (error) => console.log(`Error writing ${item.title}: ${error}`)
        );
        writePromises.push(promise);
      }
    });

    return Promise.all(writePromises);
  }

  return {
    existingTitles,
    queryItems,
    deleteOldData,
    addToFirestore,
  };
})();

const script = (() => {
  function queryAndDelete() {
    return firestore
      .queryItems("asc", 500)
      .then((querySnapshot) => firestore.deleteOldData(querySnapshot))
      .then(() => "Old data successfully deleted.")
      .catch((error) => console.error(`Error: ${error}`));
  }

  function addRssData() {
    return firestore
      .queryItems("desc", 500)
      .then((querySnapshot) => {
        querySnapshot.docs.forEach((doc) =>
          firestore.existingTitles.push(doc.data().title)
        );
        return rss.getRssData();
      })
      .then((processedData) => firestore.addToFirestore(processedData))
      .then(() => "New data successfully added.")
      .catch((error) => console.error(`Error: ${error}`));
  }

  function init() {
    queryAndDelete()
      .then((result) => {
        console.log(result);
        return addRssData();
      })
      .then((result) => {
        console.log(result);
        console.log("Script executed successfully.");
      })
      .catch((error) => console.error(`Error: ${error}`))
      .finally(() => process.exit(0)); // Terminate script
  }

  return {
    init,
  };
})();

// script.init();

// rssFeeds.getRssData().then((data) => console.log(data));
