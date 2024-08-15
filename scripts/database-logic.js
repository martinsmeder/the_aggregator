const {
  addDoc,
  collection,
  deleteDoc,
  getDocs,
  limit,
  orderBy,
  query,
} = require("firebase/firestore");
const miscHelpers = require("./utils");

const firestore = (() => {
  const existingUrls = [];

  function setExistingUrls(querySnapshot) {
    querySnapshot.docs.forEach((doc) => existingUrls.push(doc.data().url));
  }

  function queryItems(database, collectionName, order, itemLimit) {
    const collectionRef = collection(database, collectionName);
    const q = query(
      collectionRef,
      orderBy("timestamp", order),
      limit(itemLimit)
    );

    return getDocs(q);
  }

  function deleteOlderThanOneYear(querySnapshot) {
    const oneYearAgo = miscHelpers.getOneYearAgo();

    const deletionPromises = querySnapshot.docs
      .filter((doc) => doc.data().timestamp < oneYearAgo.getTime())
      // Iterate over each document in querySnapshot
      .map((doc) =>
        // Attempt to delete it, and handle errors
        deleteDoc(doc.ref).catch((error) =>
          console.error(`Error deleting ${doc.ref.path}:`, error)
        )
      );

    return Promise.all(deletionPromises);
  }

  function deleteOlderThanOneMonth(querySnapshot) {
    const oneMonthAgo = miscHelpers.getOneMonthAgo();

    const deletionPromises = querySnapshot.docs
      .filter((doc) => doc.data().timestamp < oneMonthAgo.getTime())
      // Iterate over each document in querySnapshot
      .map((doc) =>
        // Attempt to delete it, and handle errors
        deleteDoc(doc.ref).catch((error) =>
          console.error(`Error deleting ${doc.ref.path}:`, error)
        )
      );

    return Promise.all(deletionPromises);
  }

  function addToFirestore(database, collectionName, processedData) {
    const writePromises = [];

    // Iterate over the processed data items
    processedData.forEach((item) => {
      if (!existingUrls.includes(item.url)) {
        // Create a promise to add the item to the Firestore collection
        const promise = addDoc(
          collection(database, collectionName),
          item
        ).catch((error) =>
          // If there's an error while adding, log an error message
          console.log(`Error writing ${item.title}: ${error}`)
        );

        writePromises.push(promise);
      }
    });

    return Promise.all(writePromises);
  }

  function addVisitedLinkToFirestore(database, url) {
    const collectionRef = collection(database, 'visited');
    const timestamp = Date.now();

    return addDoc(collectionRef, {
      url,
      timestamp
    })
      .then(() => {
        console.log(`Added URL: ${url} to Firestore.`);
      })
      .catch((error) => {
        console.error('Error adding visited link to Firestore:', error);
        throw error;
      });
  }

  function getVisitedLinks(querySnapshot) {
    return new Promise((resolve, reject) => {
      try {
        const visitedLinks = [];

        querySnapshot.docs.forEach((doc) => {
          visitedLinks.push(doc.data().url);
        });

        resolve(visitedLinks);
      } catch (error) {
        reject(`Error retrieving visited links: ${error}`);
      }
    });
  }

  function clearFirestore(querySnapshot) {
    const deletionPromises = querySnapshot.docs.map((doc) =>
      deleteDoc(doc.ref)
    );
    return Promise.all(deletionPromises);
  }

  return {
    existingUrls,
    setExistingUrls,
    queryItems,
    deleteOlderThanOneYear,
    deleteOlderThanOneMonth,
    addToFirestore,
    addVisitedLinkToFirestore,
    getVisitedLinks,
    clearFirestore,
  };
})();

module.exports = firestore;
