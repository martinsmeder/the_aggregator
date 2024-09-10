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
    // Queries items from a Firestore collection with ordering and limit
    const collectionRef = collection(database, collectionName);  // Reference to the Firestore collection
    // Create a query to order by 'timestamp' and limit the results
    const q = query(
      collectionRef,
      orderBy("timestamp", order),  // Order by the 'timestamp' field (asc or desc)
      limit(itemLimit)  // Limit the number of items returned
    );

    return getDocs(q);  // Execute the query and return the resulting documents
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
    clearFirestore,
  };
})();

module.exports = firestore;
