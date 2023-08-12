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

// https://openai.com/blog/rss.xml
// https://www.deepmind.com/blog/rss.xml
// https://news.mit.edu/topic/mitmachine-learning-rss.xml
// API: apnews, bbc

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

// Query the "ai" collection, order by the "date" field in descending order
const q = query(collection(db, "ai"), orderBy("date", "desc"));

// Fetch the documents and render them
getDocs(q)
  .then((querySnapshot) => {
    // Get the container element
    const itemContainer = document.getElementById("itemContainer");

    // Convert the stored date string to a JavaScript Date object and then sort
    const sortedDocs = querySnapshot.docs.sort((a, b) => {
      const dateA = new Date(a.data().date);
      const dateB = new Date(b.data().date);
      return dateB - dateA; // Sort in descending order
    });

    // Iterate through the query snapshot and render documents
    sortedDocs.forEach((doc) => {
      const documentData = doc.data();

      // Create a new <div> element for each item
      const itemElement = document.createElement("div");
      itemElement.classList.add("item"); // Optional: Add a CSS class for styling

      // Create elements for each property and set their content
      const titleElement = document.createElement("h2");
      titleElement.textContent = documentData.title;

      const linkElement = document.createElement("a");
      linkElement.href = documentData.link;
      linkElement.target = "_blank";
      linkElement.textContent = "Read more";

      const descriptionElement = document.createElement("p");
      descriptionElement.textContent = documentData.description;

      const sourceElement = document.createElement("p");
      sourceElement.textContent = "Source: " + documentData.source;

      const dateElement = document.createElement("p");
      const formattedDate = documentData.date.toDate().toLocaleString();
      dateElement.textContent = "Date: " + formattedDate;

      // Append the elements to the item container
      itemElement.appendChild(titleElement);
      itemElement.appendChild(linkElement);
      itemElement.appendChild(descriptionElement);
      itemElement.appendChild(sourceElement);
      itemElement.appendChild(dateElement);

      // Append the item element to the container
      itemContainer.appendChild(itemElement);
    });
  })
  .catch((error) => {
    console.error("Error fetching and rendering documents:", error);
  });

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
