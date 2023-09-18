// Import your functions and dependencies
const scriptRunner = require("./script");

// Get avoid adding duplicates test to work

describe("queryAndDelete", () => {
  it("should delete old data successfully", async () => {
    const querySnapshot = {
      docs: [
        {
          data: () => ({
            timestamp: Date.now() - 365 * 24 * 60 * 60 * 1000 - 1,
          }),
        },
      ],
    };

    const firestore = {
      queryItems: jest.fn().mockResolvedValue(querySnapshot),
      deleteOldData: jest
        .fn()
        .mockResolvedValue("Old data successfully deleted."),
    };

    const result = await scriptRunner.queryAndDelete(firestore);

    expect(result).toBe("Old data successfully deleted.");
  });

  it("should handle errors gracefully", async () => {
    const firestore = {
      queryItems: jest.fn().mockRejectedValue(new Error("Firestore error")),
    };

    try {
      await scriptRunner.queryAndDelete(firestore);
    } catch (error) {
      expect(error.message).toBe("Firestore error");
    }
  });
});

describe("addRssData", () => {
  it("should add new data successfully", async () => {
    // Mock Firestore query result
    const querySnapshot = {
      docs: [
        // Simulate an empty query result for descending order
      ],
    };

    // Mock rssFeeds.getRssData to return some test data
    const rssFeeds = {
      getRssData: jest.fn().mockResolvedValue([
        {
          id: "123",
          title: "Test Title",
          date: "2023-08-31",
          description: "Test Description",
          source: "Test Source",
          category: "Test Category",
          url: "https://example.com",
        },
      ]),
    };

    // Mock Firestore's queryItems function to avoid messing with a real database
    const firestore = {
      queryItems: jest.fn().mockResolvedValue(querySnapshot),
      addToFirestore: jest.fn().mockResolvedValue("Data added successfully."),
      existingIds: [], // Simulate no existing data
    };

    const result = await scriptRunner.addRssData(firestore, rssFeeds);

    expect(result).toBe("New data successfully added.");
  });

  it("should avoid adding duplicates", async () => {
    // Mock Firestore query result with some existing data
    const querySnapshot = {
      docs: [
        {
          data: () => ({
            id: "123",
          }),
        },
      ],
    };

    // Mock rssFeeds.getRssData to return data with a duplicate ID
    const rssFeeds = {
      getRssData: jest.fn().mockResolvedValue([
        {
          id: "123", // Duplicate ID
          title: "Test Title",
          date: "2023-08-31",
          description: "Test Description",
          source: "Test Source",
          category: "Test Category",
          url: "https://example.com",
        },
      ]),
    };

    // Mock Firestore's queryItems function to return existing data
    const firestore = {
      queryItems: jest.fn().mockResolvedValue(querySnapshot),
      addToFirestore: jest.fn().mockResolvedValue("Data added successfully."),
      existingIds: ["123"], // Simulate existing data with the same ID
    };

    const result = await scriptRunner.addRssData(firestore, rssFeeds);

    expect(result).toBe("No new data added (duplicates found).");
  });

  it("should handle errors gracefully", async () => {
    // Mock Firestore query result to throw an error
    const firestore = {
      queryItems: jest.fn().mockRejectedValue(new Error("Firestore error")),
    };

    // Mock rssFeeds.getRssData to return some test data
    const rssFeeds = {
      getRssData: jest.fn().mockResolvedValue([
        {
          id: "123",
          title: "Test Title",
          date: "2023-08-31",
          description: "Test Description",
          source: "Test Source",
          category: "Test Category",
          url: "https://example.com",
        },
      ]),
    };

    try {
      await scriptRunner.addRssData(firestore, rssFeeds);
    } catch (error) {
      expect(error.message).toBe("Firestore error");
    }
  });
});

// describe("init", () => {
//   it("should execute successfully when queryAndDelete and addRssData succeed", async () => {
//     // Mock queryAndDelete and addRssData to succeed
//     // Call init
//     // Assert that it behaves as expected
//   });

//   it("should handle errors gracefully when queryAndDelete or addRssData fail", async () => {
//     // Mock queryAndDelete or addRssData to fail
//     // Call init
//     // Assert that it handles errors as expected
//   });
// });
