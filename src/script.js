import { db, collection, doc, getDoc, getDocs, setDoc } from "./firebase";

// https://openai.com/blog/rss.xml
// https://www.deepmind.com/blog/rss.xml
// https://news.mit.edu/topic/mitmachine-learning-rss.xml
// API: apnews, bbc

const rssFeedUrl = "https://openai.com/blog/rss.xml";
const apiUrl = `https://rss-to-json-serverless-api.vercel.app/api?feedURL=${rssFeedUrl}`;

// Make the GET request to the API
fetch(apiUrl)
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    console.log(data.items.length);

    // Get the titles of existing documents in Firestore
    getDocs(collection(db, "ai"))
      .then((querySnapshot) => {
        const existingTitles = new Set();
        querySnapshot.forEach((doc) => {
          existingTitles.add(doc.data().title);
        });

        // Loop through the first 10 items
        for (let i = 0; i <= data.items.length; i++) {
          const item = data.items[i]; // Select the item
          const titleToCheck = item.title;

          if (!existingTitles.has(titleToCheck)) {
            // Document with the title doesn't exist, add it
            setDoc(doc(collection(db, "ai"), `${item.published}`), {
              title: item.title,
              link: item.link,
              description: item.description || "No description available",
              source: data.title,
              date: new Date(item.published).toLocaleString(),
            })
              .then(() => {
                console.log("Document written successfully!");
              })
              .catch((error) => {
                console.error("Error adding document to Firestore:", error);
              });
          } else {
            console.log(
              `Document '${titleToCheck}' already exists, skipping...`
            );
          }
        }
      })
      .catch((error) => {
        console.error(
          "Error fetching existing documents from Firestore:",
          error
        );
      });
  })
  .catch((error) => {
    console.error("An error occurred:", error);
  });
