// /* eslint-disable no-undef */
// const rssFeeds = require("./rss");

// // Remember that failed tests are shown as an error, even though the test
// // "passes"

// describe("getRssData", () => {
//   it("should only get data from valid urls", async () => {
//     const urls = [
//       {
//         category: "ai",
//         url: "https://www.deepmind.com/blog/rss.xml",
//         isReddit: false,
//       },
//       {
//         category: "ai",
//         url: "https://www.reddit.com/r/artificial/top/.rss?limit=500",
//         isReddit: true,
//       },
//       {
//         category: "ai",
//         // Non existing website
//         url: "https://www.awebsitethatforcertaindoesnotexsit123.com/",
//         isReddit: false,
//       },
//       {
//         category: "ai",
//         // Website that exists but does not provide rss data
//         url: "https://scrapeme.live/shop/",
//         isReddit: false,
//       },
//     ];

//     rssFeeds
//       .getRssData(urls)
//       .then((data) => {
//         expect(data.length).not.toBe(0); // Still received rss data
//         const rssUrls = data.map((item) => item.url);
//         const validUrls = rssUrls.every(
//           (url) => url.includes("reddit") || url.includes("deepmind")
//         );
//         expect(validUrls).toBe(true); // Only received data from valid urls
//       })
//       .catch((error) => console.error(error));
//   });
// });
