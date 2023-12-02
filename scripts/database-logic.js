const {
  addDoc,
  collection,
  deleteDoc,
  getDocs,
  limit,
  orderBy,
  query,
} = require("firebase/firestore");
const rssFeeds = require("./rss");

const firestore = (() => {
  const existingIds = [];

  function setExistingIds(querySnapshot) {
    querySnapshot.docs.forEach((doc) => existingIds.push(doc.data().rssId));
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
    const oneYearAgo = rssFeeds.getOneYearAgo();

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
    const oneMonthAgo = rssFeeds.getOneMonthAgo();

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
      if (!existingIds.includes(item.rssId)) {
        // Create a promise to add the item to the Firestore collection
        const promise = addDoc(
          collection(database, collectionName),
          item
        ).catch((error) =>
          // If there's an error while adding, log an error message
          console.log(`Error writing ${item.rssId}: ${error}`)
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

  function queryAndDelete(
    database,
    collectionName,
    deleteOrder,
    orderLimit,
    callback
  ) {
    return firestore
      .queryItems(database, collectionName, deleteOrder, orderLimit)
      .then((querySnapshot) => callback(querySnapshot))
      .then(() => "Old data successfully deleted.")
      .catch((error) => console.error(`Error: ${error}`));
  }

  function addRssData(
    database,
    collectionName,
    addOrder,
    orderLimit,
    callback
  ) {
    return (
      firestore
        .queryItems(database, collectionName, addOrder, orderLimit)
        .then((querySnapshot) => {
          firestore.setExistingIds(querySnapshot);
          return callback;
        })
        .then((processedData) =>
          firestore.addToFirestore(database, collectionName, processedData)
        )
        // eslint-disable-next-line no-return-assign
        .then(() => (firestore.existingIds.length = 0))
        .then(() => "New data successfully added.")
        .catch((error) => console.error(`Error: ${error}`))
    );
  }

  function init(
    database,
    collectionName,
    deleteOrder,
    addOrder,
    orderLimit,
    deleteCallback,
    addCallback
  ) {
    queryAndDelete(
      database,
      collectionName,
      deleteOrder,
      orderLimit,
      deleteCallback
    )
      .then((result) => {
        console.log(result);
        return addRssData(
          database,
          collectionName,
          addOrder,
          orderLimit,
          addCallback
        );
      })
      .then((result) => {
        console.log(result);
        console.log("Script executed successfully.");
      })
      .catch((error) => console.error(`Error: ${error}`))
      .finally(() => process.exit(0)); // Terminate script
  }

  return {
    existingIds,
    setExistingIds,
    queryItems,
    deleteOlderThanOneYear,
    deleteOlderThanOneMonth,
    addToFirestore,
    clearFirestore,
    init,
  };
})();

module.exports = firestore;
