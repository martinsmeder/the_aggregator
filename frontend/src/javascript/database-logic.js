import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";

function getLastVisible(querySnapshot) {
  if (querySnapshot) return querySnapshot.docs[querySnapshot.docs.length - 1];
  return null;
}

export function getSingleQuery(database, collectionName) {
  const collectionRef = collection(database, collectionName);
  const q = query(collectionRef);

  return getDocs(q);
}

export function getFeedQueries(database, category, querySnapshot = null) {
  const collectionRef = collection(database, "feeds");
  const lastVisible = getLastVisible(querySnapshot);

  let q = query(
    collectionRef,
    orderBy("timestamp", "desc"),
    limit(10),
    where("category", "==", category)
  );

  if (lastVisible) {
    q = query(
      collectionRef,
      orderBy("timestamp", "desc"),
      limit(10),
      where("category", "==", category),
      startAfter(lastVisible)
    );
  }

  return getDocs(q);
}
