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
const fetch = require("node-fetch");

const rss = (() => {
  const urls = [
    { category: "ai", url: "https://www.deepmind.com/blog/rss.xml" },
    {
      category: "ai",
      url: "https://news.mit.edu/topic/mitmachine-learning-rss.xml",
    },
  ];

  function getPromises() {
    const api = "https://rss-to-json-serverless-api.vercel.app/api?feedURL=";
    const promises = urls.map((source) => fetch(api + source.url));
    return promises;
  }

  function getOneYearAgo() {
    const today = new Date();
    const oneYearAgo = new Date(
      today.getFullYear() - 1,
      today.getMonth(),
      today.getDate()
    );
    return oneYearAgo;
  }

  function parse(array, category) {
    const oneYearAgo = getOneYearAgo();
    const parsedData = array.items
      .filter((item) => new Date(item.published) > oneYearAgo)
      .map((item) => {
        const date = new Date(item.published);
        return {
          date: date.toLocaleString(),
          title: item.title,
          link: item.link,
          description: item.description || "No description available",
          source: array.title,
          category: category,
          timestamp: new Date(item.published).getTime(),
        };
      });

    return parsedData;
  }

  function sort(array) {
    const flattened = array.flat();
    const sorted = flattened.sort((a, b) => b.date - a.date);
    return sorted;
  }

  function getRssData() {
    return new Promise((resolve, reject) => {
      const promises = getPromises();

      Promise.all(promises)
        .then((responses) =>
          Promise.all(responses.map((response) => response.json()))
        )
        .then((dataArray) =>
          sort(
            dataArray.map((data, index) => parse(data, urls[index].category))
          )
        )
        .then((processed) => resolve(processed))
        .catch((error) => reject(error));
    });
  }

  return {
    getOneYearAgo,
    getRssData,
  };
})();

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

script.init();
