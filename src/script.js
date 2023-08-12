import {
  db,
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  writeBatch,
  query,
  where,
  deleteDoc,
  orderBy,
  setDoc,
} from "./firebase";

// API: apnews, bbc

const rssFeeder = (() => {
  let existingTitlesSet = new Set();

  const feedUrls = [
    { openai: "https://openai.com/blog/rss.xml" },
    { deepmind: "https://www.deepmind.com/blog/rss.xml" },
    { mitNews: "https://news.mit.edu/topic/mitmachine-learning-rss.xml" },
  ];

  function parseData(data) {
    // Utilizing the map function to iterate through each object in the 'items' array,
    // and transforming it into the structured format described below.
    const parsedData = data.items.map((item) => {
      return {
        // Extract the title, link, description, source and date property from the current item
        title: item.title,
        link: item.link,
        description: item.description || "No description available",
        source: data.title,
        date: new Date(item.published),
      };
    });

    return parsedData;
  }

  function fetchData(url) {
    const apiUrl = `https://rss-to-json-serverless-api.vercel.app/api?feedURL=${url}`;
    return fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        const parsedData = parseData(data);
        console.log(parsedData);
        return parsedData;
      })
      .catch((error) => {
        console.error("An error occurred while fetching data:", error);
        throw error;
      });
  }

  function getExistingTitles() {
    return getDocs(collection(db, "ai"))
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          existingTitlesSet.add(doc.data().title);
        });
        console.log(existingTitlesSet);
        return existingTitlesSet;
      })
      .catch((error) => {
        console.error("Error getting existing titles:", error);
        throw error;
      });
  }

  function addToFirestore(parsedData) {
    return getExistingTitles()
      .then(() => {
        const promises = [];

        parsedData.forEach((item) => {
          const titleToCheck = item.title;

          if (!existingTitlesSet.has(titleToCheck)) {
            const promise = addDoc(collection(db, "ai"), {
              title: item.title,
              link: item.link,
              description: item.description,
              source: item.source,
              date: item.date,
            })
              .then(() => {
                console.log(`Document '${titleToCheck}' written successfully!`);
                existingTitlesSet.add(titleToCheck);
              })
              .catch((error) => {
                console.error("Error adding document to Firestore:", error);
              });

            promises.push(promise);
          } else {
            console.log(
              `Document '${titleToCheck}' already exists, skipping...`
            );
          }
        });

        return Promise.all(promises);
      })
      .then(() => {
        existingTitlesSet.clear();
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  }

  function deleteOldData() {
    // ...
  }

  return {
    feedUrls,
    fetchData,
    addToFirestore,
  };
})();

rssFeeder
  .fetchData("https://openai.com/blog/rss.xml")
  .then((parsedData) => {
    return rssFeeder.addToFirestore(parsedData);
  })
  .catch((error) => {
    console.error("An error occurred:", error);
  });

// https://openai.com/blog/rss.xml
// https://www.deepmind.com/blog/rss.xml
// https://news.mit.edu/topic/mitmachine-learning-rss.xml

// ==========================================================================================

// const today = new Date();
// const oneYearAgo = new Date();
// oneYearAgo.setFullYear(today.getFullYear() - 1);

// console.log("Today:", today);
// console.log("One Year Ago:", oneYearAgo);

// const q = query(collection(db, "ai"), where("date", "<", oneYearAgo));

// getDocs(q)
//   .then((querySnapshot) => {
//     console.log("Query snapshot length:", querySnapshot.size);
//     querySnapshot.forEach((doc) => {
//       const documentData = doc.data();
//       console.log("Document data:", documentData);
//       console.log("Deleting document:", documentData.title);
//       deleteDoc(doc.ref)
//         .then(() => {
//           console.log("Document deleted successfully!");
//         })
//         .catch((error) => {
//           console.error("Error deleting document:", error);
//         });
//     });
//   })
//   .catch((error) => {
//     console.error("Error fetching and deleting documents:", error);
//   });
