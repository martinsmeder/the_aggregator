import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "./firebase";

// What's going on with the reddit data?
// Should I really use worldNews, as they seem to be spamming content?
// Use same file for imports or no?

function queryItems(order, itemLimit) {
  const collectionRef = collection(db, "all-items");
  const q = query(collectionRef, orderBy("timestamp", order), limit(itemLimit));

  return getDocs(q);
}

function renderItems() {
  queryItems("desc", 500)
    .then((querySnapshot) => {
      const itemContainer = document.getElementById("itemContainer");
      itemContainer.innerHTML = "";

      querySnapshot.forEach((doc) => {
        const item = doc.data();
        const itemElement = document.createElement("div");
        itemElement.innerHTML = `
        <div>
          <h3>${item.title}</h3>
          <p>Date: ${item.date}</p>
          <p>Description: ${item.description}</p>
          <p>Source: ${item.source}</p>
          <p>Category: ${item.category}</p>
          <a href="${item.url}" target="_blank">Read more</a>
        </div>
        <hr>
      `;

        itemContainer.appendChild(itemElement);
      });
    })
    .catch((error) => {
      console.error("Error fetching and rendering items:", error);
    });
}

document.addEventListener("DOMContentLoaded", renderItems);
