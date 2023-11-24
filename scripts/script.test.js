// /* eslint-disable no-undef */
// const firestore = require("./script");
// const { testDb } = require("./firebase-test-cjs");

// // HOW TO TEST:
// // * Make sure database is empty before running tests
// // * Comment out { db } import (top of script.js), as well as init call (bottom of script.js)
// // * Uncomment and run one test at a time
// // * If a test fails, the information will be shown as a console.error, even though the test
// //   "passed"

// // ======================================== TESTS =============================================

// describe("addToFirestore", () => {
//   it("should avoid creating duplicates in the test database", async () => {
//     const initialData = [
//       {
//         rssId: "1",
//         timestamp: new Date("2023-08-31T00:00:00Z").getTime(),
//       },
//     ];

//     const dataToAdd = [
//       {
//         rssId: "1",
//         timestamp: new Date("2023-08-31T00:00:00Z").getTime(),
//       },
//       {
//         rssId: "2",
//         timestamp: new Date("2023-09-01T00:00:00Z").getTime(),
//       },
//     ];

//     firestore
//       .addToFirestore(testDb, initialData)
//       .then(() => firestore.queryItems(testDb, "asc", 10))
//       .then((querySnapshot) => {
//         expect(querySnapshot.size).toBe(1); // Initial data is added
//         firestore.setExistingIds(querySnapshot);
//         return firestore.addToFirestore(testDb, dataToAdd);
//       })
//       .then(() => firestore.queryItems(testDb, "asc", 10))
//       .then((querySnapshot) => {
//         expect(querySnapshot.size).toBe(2); // Only one added item
//         expect(querySnapshot.docs[0].data().rssId).toBe("1"); // One id
//         expect(querySnapshot.docs[1].data().rssId).toBe("2"); // Another id (no duplicates)
//         firestore.existingIds.length = 0;
//         return firestore.clearFirestore(querySnapshot);
//       })
//       .catch((error) => console.error(error))
//       .finally(() => process.exit(0));
//   });
// });

// describe("deleteOldData", () => {
//   it("should only delete old data from the test database", async () => {
//     const data = [
//       {
//         title: "New Data",
//         timestamp: new Date("2023-08-31T00:00:00Z").getTime(),
//       },
//       {
//         title: "Old Data",
//         timestamp: new Date("2022-08-31T00:00:00Z").getTime(),
//       },
//     ];

//     firestore
//       .addToFirestore(testDb, data)
//       .then(() => firestore.queryItems(testDb, "asc", 10))
//       .then((querySnapshot) => {
//         expect(querySnapshot.size).toBe(2); // Both items are added
//         return querySnapshot;
//       })
//       .then((querySnapshot) => firestore.deleteOldData(querySnapshot))
//       .then(() => firestore.queryItems(testDb, "asc", 10))
//       .then((querySnapshot) => {
//         expect(querySnapshot.size).toBe(1); // Only one item left, and it's the...
//         expect(querySnapshot.docs[0].data().title).toBe("New Data"); // ... correct item!
//         return firestore.clearFirestore(querySnapshot);
//       })
//       .catch((error) => console.error(error)) // Read logs to make sure test actually passed
//       .finally(() => process.exit(0));
//   });
// });
