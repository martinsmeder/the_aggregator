import {
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
// 4. Check for duplicates -
// 5. Add new data

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

    const deletionPromises = querySnapshot.docs
      .filter((doc) => doc.data().timestamp < oneYearAgo.getTime())
      .map((doc) => deleteDoc(doc.ref));

    return Promise.all(deletionPromises);
  }

  function addToFirestore(processedData) {
    const batch = writeBatch(db); // Max batch = 500 operations

    processedData.forEach((item) => {
      const collectionRef = collection(db, "all-items");
      const docRef = doc(collectionRef);
      batch.set(docRef, item);
    });

    return batch.commit();
  }
  return {
    queryItems,
    deleteOldData,
    addToFirestore,
  };
})();

// Delete old data:
// firestore
//   .queryItems("asc", 50)
//   .then((querySnapshot) => firestore.deleteOldData(querySnapshot))
//   .then(() => console.log("Old data successfully deleted."))
//   .catch((error) => console.error("Error:", error));

// // Add new data:
// rss
//   .getRssData()
//   .then((processedData) => {
//     console.log(processedData);
//     return firestore.addToFirestore(processedData);
//   })
//   .then(() => console.log("Items successfully added to Firestore"))
//   .catch((error) => console.error(error));
// ==========================================================================================

// function addToFirestore(parsedData) {
//   return getExistingTitles()
//     .then(() => {
//       const promises = [];

//       parsedData.forEach((item) => {
//         const titleToCheck = item.title;

//         if (!existingTitlesSet.has(titleToCheck)) {
//           const promise = addDoc(collection(db, "ai"), {
//             title: item.title,
//             link: item.link,
//             description: item.description,
//             source: item.source,
//             date: item.date,
//           })
//             .then(() => {
//               console.log(`Document '${titleToCheck}' written successfully!`);
//               existingTitlesSet.add(titleToCheck);
//             })
//             .catch((error) => {
//               console.error("Error adding document to Firestore:", error);
//             });

//           promises.push(promise);
//         } else {
//           console.log(`Document '${titleToCheck}' already exists, skipping...`);
//         }
//       });

//       return Promise.all(promises);
//     })
//     .then(() => {
//       existingTitlesSet.clear();
//     })
//     .catch((error) => {
//       console.error("An error occurred:", error);
//     });
// }

// function deleteOldData() {
//   const today = new Date();
//   const oneYearAgo = new Date();
//   oneYearAgo.setFullYear(today.getFullYear() - 1);

//   console.log("Today:", today);
//   console.log("One Year Ago:", oneYearAgo);

//   const q = query(collection(db, "ai"), where("date", "<", oneYearAgo));

//   getDocs(q)
//     .then((querySnapshot) => {
//       console.log("Query snapshot length:", querySnapshot.size);
//       querySnapshot.forEach((doc) => {
//         const documentData = doc.data();
//         console.log("Document data:", documentData);
//         console.log("Deleting document:", documentData.title);
//         deleteDoc(doc.ref)
//           .then(() => {
//             console.log("Document deleted successfully!");
//           })
//           .catch((error) => {
//             console.error("Error deleting document:", error);
//           });
//       });
//     })
//     .catch((error) => {
//       console.error("Error fetching and deleting documents:", error);
//     });
// }

// fetchData("https://news.mit.edu/topic/mitmachine-learning-rss.xml")
//   .then((parsedData) => {
//     return rssFeeder.addToFirestore(parsedData);
//   })
//   .catch((error) => {
//     console.error("An error occurred:", error);
//   });

// ==========================================================================================
