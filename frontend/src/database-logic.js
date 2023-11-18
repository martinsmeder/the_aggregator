import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
// import { testDb } from "./firebase-test";

function getLastVisible(querySnapshot) {
  if (querySnapshot) return querySnapshot.docs[querySnapshot.docs.length - 1];
  return null;
}

export function getHomeQuery(database, querySnapshot = null) {
  const collectionRef = collection(database, "all-items");
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

export function getCategoryQuery(database, category, querySnapshot = null) {
  const collectionRef = collection(database, "all-items");
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

//   getCategoryQuery(testDb, "ai", null)
//   .then((querySnapshot) => {
//     console.log("First: ");
//     querySnapshot.forEach((doc) => console.log(doc.data().title));
//     return firebase.getCategoryQuery(testDb, "ai", querySnapshot);
//   })
//   .then((querySnapshot) => {
//     console.log("Second: ");
//     querySnapshot.forEach((doc) => console.log(doc.data().title));
//     return firebase.getCategoryQuery(testDb, "ai", querySnapshot);
//   })
//   .then((querySnapshot) => {
//     console.log("Third: ");
//     querySnapshot.forEach((doc) => console.log(doc.data().title));
//   })
//   .catch((error) => console.error(error));
