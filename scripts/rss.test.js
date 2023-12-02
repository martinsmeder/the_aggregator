// /* eslint-disable no-undef */
// const rssFeeds = require("./rss");

// // Remember that failed tests are shown as an error, even though the test
// // "passes"

// const urls = [
//   {
//     category: "ai",
//     url: "https://www.deepmind.com/blog/rss.xml",
//     isReddit: false,
//   },
//   {
//     category: "ai",
//     url: "https://www.reddit.com/r/artificial/top/.rss?limit=500",
//     isReddit: true,
//   },
//   {
//     category: "ai",
//     // Non existing website
//     url: "https://www.awebsitethatforcertaindoesnotexsit123.com/",
//     isReddit: false,
//   },
//   {
//     category: "ai",
//     // Website that exists but does not provide rss data
//     url: "https://scrapeme.live/shop/",
//     isReddit: false,
//   },
// ];

// describe("getRssData", () => {
//   it("should only get data from valid urls", async () => {
//     rssFeeds
//       .getRssData(urls)
//       .then((data) => {
//         // Assertion: Ensure that received data is not empty (length is not zero)
//         expect(data.length).not.toBe(0); // Still received RSS data

//         // Extract URLs from the received data
//         const rssUrls = data.map((item) => item.url);

//         // Checking if all the URLs are valid (contain either "reddit" or "deepmind")
//         const validUrls = rssUrls.every(
//           (url) => url.includes("reddit") || url.includes("deepmind")
//         );

//         // Assertion: Ensure that all received data URLs are valid
//         expect(validUrls).toBe(true);
//       })
//       .catch((error) => console.error(error))
//       .finally(() => process.exit(0));
//   });
// });

// describe("checkFeeds", () => {
//   it("should return an array of dead URLs", async () => {
//     rssFeeds
//       .checkFeeds(urls)
//       .then((result) => {
//         expect(result.length).toBe(2);
//         // Assert that specific dead URLs are present in the result array
//         expect(result).toContain(
//           "https://www.awebsitethatforcertaindoesnotexsit123.com/"
//         );
//         expect(result).toContain("https://scrapeme.live/shop/");
//       })
//       .catch((error) => console.error(error))
//       .finally(() => process.exit(0));
//   });
// });
