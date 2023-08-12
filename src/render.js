// // Query the "ai" collection, order by the "date" field in descending order
// const q = query(collection(db, "ai"), orderBy("date", "desc"));

// // Fetch the documents and render them
// getDocs(q)
//   .then((querySnapshot) => {
//     // Get the container element
//     const itemContainer = document.getElementById("itemContainer");

//     // Convert the stored date string to a JavaScript Date object and then sort
//     const sortedDocs = querySnapshot.docs.sort((a, b) => {
//       const dateA = new Date(a.data().date);
//       const dateB = new Date(b.data().date);
//       return dateB - dateA; // Sort in descending order
//     });

//     // Iterate through the query snapshot and render documents
//     sortedDocs.forEach((doc) => {
//       const documentData = doc.data();

//       // Create a new <div> element for each item
//       const itemElement = document.createElement("div");
//       itemElement.classList.add("item"); // Optional: Add a CSS class for styling

//       // Create elements for each property and set their content
//       const titleElement = document.createElement("h2");
//       titleElement.textContent = documentData.title;

//       const linkElement = document.createElement("a");
//       linkElement.href = documentData.link;
//       linkElement.target = "_blank";
//       linkElement.textContent = "Read more";

//       const descriptionElement = document.createElement("p");
//       descriptionElement.textContent = documentData.description;

//       const sourceElement = document.createElement("p");
//       sourceElement.textContent = "Source: " + documentData.source;

//       const dateElement = document.createElement("p");
//       const formattedDate = documentData.date.toDate().toLocaleString();
//       dateElement.textContent = "Date: " + formattedDate;

//       // Append the elements to the item container
//       itemElement.appendChild(titleElement);
//       itemElement.appendChild(linkElement);
//       itemElement.appendChild(descriptionElement);
//       itemElement.appendChild(sourceElement);
//       itemElement.appendChild(dateElement);

//       // Append the item element to the container
//       itemContainer.appendChild(itemElement);
//     });
//   })
//   .catch((error) => {
//     console.error("Error fetching and rendering documents:", error);
//   });
