import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  writeBatch,
} from "firebase/firestore";
import { db } from "./firebase";

// "desc": 1/9 23 --> 7/12 23
// "asc": 10/19 20 --> 11/9 21

// 0. ---
// 1. ---
// 2. ---
// 3. ---
// 4. ---
// 5. ---
// 6. Simulate the real thing and make sure duplication is avoided, and deletion works as well
// 7. Batch write instead
// 8. Check for improvements
// 9. Try out github actions
// 10. Start building the real thing, starting with API's, and adding RSS where needed

// https://pmarca.substack.com/feed

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
      // .filter((item) => new Date(item.published) > oneYearAgo)
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
    // Return promise in order to continue the chain when calling getRssData()
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
    const deletionPromises = [];

    const itemsToDelete = querySnapshot.docs.filter(
      (doc) => doc.data().timestamp < oneYearAgo.getTime()
    );

    itemsToDelete.forEach((doc) => {
      const itemToDelete = deleteDoc(doc.ref).catch((error) =>
        console.error(`Error deleting ${doc.ref.path}:`, error)
      );
      deletionPromises.push(itemToDelete);
    });

    return Promise.all(deletionPromises);
  }

  // function addToFirestore(processedData) {
  //   const batch = writeBatch(db); // Max batch = 500 operations

  //   processedData.forEach((item) => {
  //     const collectionRef = collection(db, "all-items");
  //     const docRef = doc(collectionRef);
  //     batch.set(docRef, item);
  //   });

  //   return batch.commit();
  // }

  function addToFirestore(processedData) {
    // const batch = writeBatch(db); // Max batch = 500 operations
    // const collectionRef = collection(db, "all-items");
    const writePromises = [];

    processedData.forEach((item) => {
      if (!existingTitles.includes(item.title)) {
        const promise = addDoc(collection(db, "all-items"), item)
          .then(() => console.log(`${item.title} added successfully.`))
          .catch((error) =>
            console.log(`Error writing ${item.title}: ${error}`)
          );
        writePromises.push(promise);
      } else {
        console.log(`${item.title} already exists, skipping.`);
      }
    });

    return Promise.all(writePromises);
  }

  return {
    queryItems,
    deleteOldData,
    addToFirestore,
  };
})();

// firestore
//   .queryItems("asc", 50)
//   .then((querySnapshot) => firestore.deleteOldData(querySnapshot))
//   .then(() => console.log("Old data successfully deleted."))
//   .catch((error) => console.error("Error:", error));

const existingTitles = [];

// firestore
//   .queryItems("desc", 50)
//   .then((querySnapshot) => {
//     querySnapshot.docs.forEach((doc) => existingTitles.push(doc.data().title));
//     return rss.getRssData();
//   })
//   .then((processedData) => firestore.addToFirestore(processedData))
//   .then(() => console.log("New data successfully added."))
//   .then(() => (existingTitles.length = 0))
//   .catch((error) => console.log(error));
