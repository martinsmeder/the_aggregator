import {
  collection,
  getDocs,
  query,
} from "firebase/firestore";

export function getSingleQuery(database, collectionName) {
  const collectionRef = collection(database, collectionName);
  const q = query(collectionRef);

  return getDocs(q);
}
