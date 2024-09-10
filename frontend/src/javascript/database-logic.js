import {
  collection,
  getDocs,
  query,
} from "firebase/firestore";

export function getSingleQuery(database, collectionName) {
  // Reference to the specified collection in the database
  const collectionRef = collection(database, collectionName);

  // Create a query to get all documents from the collection
  const q = query(collectionRef);

  // Return a promise that resolves with the query results
  return getDocs(q);
}
