const { scriptRunner, firestore } = require("./script");
const { testDb } = require("./firebase-test-cjs");

// =========================================================================================

// describe("addToFirestore", () => {
//   it("should avoid creating duplicates in the test database", async () => {
//     const initialData = [
//       {
//         rssId: "1",
//       },
//     ];

//     const dataToAdd = [
//       {
//         rssId: "1",
//       },
//       {
//         rssId: "2",
//       },
//     ];

//     firestore
//       .addToFirestore(testDb, initialData)
//       .then(() => firestore.queryItems(testDb, "asc", 10))
//       .then((querySnapshot) => expect(querySnapshot.size).toBe(1))
//       .then(() => {
//         firestore.addToFirestore(testDb, dataToAdd);
//         return firestore.queryItems(testDb, "asc", 10);
//       })
//       .then((querySnapshot) => {
//         expect(querySnapshot.size).toBe(2);
//         expect(querySnapshot.docs[0].data().rssId).toBe("1");
//         expect(querySnapshot.docs[1].data().rssId).toBe("3");
//         firestore.existingIds.length = 0;
//         return firestore.clearFirestore(querySnapshot);
//       })
//       .catch((error) => console.error(error))
//       .finally(() => process.exit(0));
//   });
// });

describe("deleteOldData", () => {
  it("should only delete old data from the test database", async () => {
    const data = [
      {
        title: "New Data",
        timestamp: new Date("2023-08-31T00:00:00Z").getTime(),
      },
      {
        title: "Old Data",
        timestamp: new Date("2022-08-31T00:00:00Z").getTime(),
      },
    ];

    firestore // Make sure database is empty before testing!
      .addToFirestore(testDb, data)
      .then(() => firestore.queryItems(testDb, "asc", 10))
      .then((querySnapshot) => {
        expect(querySnapshot.size).toBe(2); // Both items are added
        return querySnapshot;
      })
      .then((querySnapshot) => firestore.deleteOldData(querySnapshot))
      .then(() => firestore.queryItems(testDb, "asc", 10))
      .then((querySnapshot) => {
        expect(querySnapshot.size).toBe(1); // Only one item left, and it's the...
        expect(querySnapshot.docs[0].data().title).toBe("New Data"); // ... correct item!
        return firestore.clearFirestore(querySnapshot);
      })
      .catch((error) => console.error(error)) // Read logs to make sure test actually passed
      .finally(() => process.exit(0));
  });
});
