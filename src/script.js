import {
  db,
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  orderBy,
  setDoc,
} from "./firebase";

// API: apnews, bbc

const rssFeeder = (() => {
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
        const titles = [];
        querySnapshot.forEach((doc) => {
          titles.push(doc.data().title);
        });
        console.log(titles);
        return titles;
      })
      .catch((error) => {
        console.error("Error getting existing titles:", error);
        throw error;
      });
  }

  function addToFirestore() {
    // ...
  }

  function deleteOldData() {
    // ...
  }

  return {
    feedUrls,
    fetchData,
    getExistingTitles,
  };
})();

rssFeeder.fetchData("https://openai.com/blog/rss.xml");
rssFeeder.getExistingTitles();

// https://openai.com/blog/rss.xml
// https://www.deepmind.com/blog/rss.xml
// https://news.mit.edu/topic/mitmachine-learning-rss.xml

// ==========================================================================================

// const rssFeedUrl = "https://news.mit.edu/topic/mitmachine-learning-rss.xml";
// const apiUrl = `https://rss-to-json-serverless-api.vercel.app/api?feedURL=${rssFeedUrl}`;

// // Make the GET request to the API
// fetch(apiUrl)
//   .then((response) => response.json())
//   .then((data) => {
//     console.log(data);
//     console.log(data.items.length);

//     // Get the titles of existing documents in Firestore
//     getDocs(collection(db, "ai"))
//       .then((querySnapshot) => {
//         const existingTitles = new Set();
//         querySnapshot.forEach((doc) => {
//           existingTitles.add(doc.data().title);
//         });

//         // Loop entire data.items array
//         for (let i = 0; i < data.items.length; i++) {
//           console.log(i);
//           const item = data.items[i]; // Select the item
//           const titleToCheck = item.title;

//           if (!existingTitles.has(titleToCheck)) {
//             // Document with the title doesn't exist, add it
//             addDoc(collection(db, "ai"), {
//               title: item.title,
//               link: item.link,
//               description: item.description || "No description available",
//               source: data.title,
//               date: new Date(item.published),
//             })
//               .then(() => {
//                 console.log(`Document '${titleToCheck}' written successfully!`);
//               })
//               .catch((error) => {
//                 console.error("Error adding document to Firestore:", error);
//               });
//           } else {
//             console.log(
//               `Document '${titleToCheck}' already exists, skipping...`
//             );
//           }
//         }
//       })
//       .catch((error) => {
//         console.error(
//           "Error fetching existing documents from Firestore:",
//           error
//         );
//       });
//   })
//   .catch((error) => {
//     console.error("An error occurred:", error);
//   });

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
