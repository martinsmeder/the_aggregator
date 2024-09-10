import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
} from "firebase/firestore";

function getLastVisible(querySnapshot) {
  // Check if querySnapshot exists and contains documents
  if (querySnapshot && querySnapshot.docs && querySnapshot.docs.length > 0) {
    // Return the last document from the querySnapshot
    return querySnapshot.docs[querySnapshot.docs.length - 1];
  }
  // Return null if querySnapshot doesn't exist or has no documents
  return null;
}

export function getSingleQuery(database, collectionName) {
  const collectionRef = collection(database, collectionName);
  const q = query(collectionRef);

  return getDocs(q);
}

export function getAllQueries(database, collectionName, querySnapshot = null) {
  const collectionRef = collection(database, collectionName);
  const lastVisible = getLastVisible(querySnapshot);

  let q = query(collectionRef, orderBy("timestamp", "desc"), limit(10));

  if (lastVisible) {
    q = query(
      collectionRef,
      orderBy("timestamp", "desc"),
      limit(10),
      startAfter(lastVisible)
    );
  }

  return getDocs(q);
}

export function getNews(database, querySnapshot = null) {
  const collectionRef = collection(database, "news");
  const lastVisible = getLastVisible(querySnapshot);

  let q = query(collectionRef, orderBy("timestamp", "desc"), limit(10));

  if (lastVisible) {
    q = query(
      collectionRef,
      orderBy("timestamp", "desc"),
      limit(10),
      startAfter(lastVisible)
    );
  }

  return getDocs(q);
}
