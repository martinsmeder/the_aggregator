/* eslint-disable no-shadow */
const fetch = require("node-fetch");
const miscHelpers = require("./utils");

const rssFeeds = (() => {
  const urls = [
    {
      category: "ai",
      url: "https://news.mit.edu/topic/mitmachine-learning-rss.xml",
      isReddit: false,
    },
    {
      category: "ai",
      url: "https://deepmind.com/blog/feed/basic/",
      isReddit: false,
    },
    {
      category: "ai",
      url: "http://www.sciencedaily.com/rss/computers_math/artificial_intelligence.xml",
      isReddit: false,
    },
    {
      category: "ai",
      url: "https://www.reddit.com/r/artificial/top/.rss?limit=500",
      isReddit: true,
    },
    {
      category: "science",
      url: "http://www.sciencedaily.com/rss/mind_brain.xml",
      isReddit: false,
    },
    {
      category: "science",
      url: "http://feeds.arstechnica.com/arstechnica/science",
      isReddit: false,
    },
    {
      category: "gaming",
      url: "http://feeds.arstechnica.com/arstechnica/gaming/",
      isReddit: false,
    },
    {
      category: "gaming",
      url: "https://www.polygon.com/rss/index.xml",
      isReddit: false,
    },
  ];

  function getPromises(urls) {
    const api = "https://rss-to-json-serverless-api.vercel.app/api?feedURL=";
    const promises = urls.map((source) =>
      // Create an array of promises by fetching each source in urls array
      fetch(api + source.url).then((response) => {
        if (response.ok) return response;
        return null;
      })
    );
    return promises;
  }

  // eslint-disable-next-line no-shadow
  function getRssData(urls) {
    return new Promise((resolve, reject) => {
      const promises = getPromises(urls);

      Promise.all(promises)
        .then((responses) => {
          // Filter out null responses
          const filtered = responses.filter((response) => response);
          // Return an array of responses converted to json format
          return Promise.all(filtered.map((response) => response.json()));
        })
        .then((dataArray) =>
          dataArray
            // Map each parsed data array with category and isReddit values
            .map((data, index) =>
              miscHelpers.parseFeedData(
                data,
                urls[index].category,
                urls[index].isReddit
              )
            )
            // Flatten into an array of items only, instead of an array with arrays of items
            .flat()
        )
        .then((processed) => resolve(processed))
        .catch((error) => reject(error));
    });
  }

  function checkFeeds(urls) {
    const promises = getPromises(urls);

    return Promise.all(promises)
      .then((responses) => {
        const deadUrls = [];

        responses.forEach((response, index) => {
          if (!response) {
            deadUrls.push(urls[index].url);
          }
        });

        if (deadUrls.length === 0) {
          return "All feeds valid";
        }
        return deadUrls;
      })
      .catch((error) => console.error(error));
  }

  return {
    urls,
    getPromises,
    getRssData,
    checkFeeds,
  };
})();

rssFeeds.checkFeeds(rssFeeds.urls).then((result) => console.log(result));

module.exports = rssFeeds;
