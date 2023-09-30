const fetch = require("node-fetch");

const rssFeeds = (() => {
  const urls = [
    {
      category: "ai",
      url: "https://news.mit.edu/topic/mitmachine-learning-rss.xml",
      isReddit: false,
    },
    {
      category: "ai",
      url: "https://www.deepmind.com/blog/rss.xml",
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
      category: "programming",
      url: "https://www.reddit.com/r/programming/top/.rss?limit=500",
      isReddit: true,
    },
    {
      category: "programming",
      url: "http://blog.stackoverflow.com/feed/",
      isReddit: false,
    },
    {
      category: "programming",
      url: "http://githubengineering.com/atom.xml",
      isReddit: false,
    },
    {
      category: "science",
      url: "https://www.reddit.com/r/science/top/.rss?limit=500",
      isReddit: true,
    },
    {
      category: "science",
      url: "http://newsrss.bbc.co.uk/rss/newsonline_world_edition/science/nature/rss.xml",
      isReddit: false,
    },
    {
      category: "science",
      url: "http://www.sciencedaily.com/rss/mind_brain/neuroscience.xml",
      isReddit: false,
    },
    {
      category: "business",
      url: "http://newsrss.bbc.co.uk/rss/newsonline_world_edition/business/rss.xml",
      isReddit: false,
    },
    {
      category: "business",
      url: "http://www.forbes.com/entrepreneurs/index.xml",
      isReddit: false,
    },
    {
      category: "world",
      url: "http://feeds.bbci.co.uk/news/world/rss.xml",
      isReddit: false,
    },
  ];

  // eslint-disable-next-line no-shadow
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

  function getOneYearAgo() {
    const today = new Date();
    const oneYearAgo = new Date(
      today.getFullYear() - 1,
      today.getMonth(),
      today.getDate()
    );
    return oneYearAgo;
  }

  function parse(array, category, isReddit) {
    const oneYearAgo = getOneYearAgo();
    const parsedData = array.items
      .filter((item) => new Date(item.published) > oneYearAgo)
      .map((item) => {
        const date = new Date(item.published);
        return {
          magazineView: true,
          isReddit,
          rssId: isReddit
            ? `${item.category.label}: ${item.url} `
            : `${array.title}: ${item.url}`,
          date: date.toLocaleString(),
          title: item.title,
          url: item.url,
          description: isReddit
            ? item.content || "No description available"
            : item.description || "No description available",
          source: isReddit ? item.category.label : array.title,
          category,
          timestamp: date.getTime(),
        };
      });

    return parsedData;
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
              parse(data, urls[index].category, urls[index].isReddit)
            )
            // Flatten into an array of items only, instead of an array with arrays of items
            .flat()
        )
        .then((processed) => resolve(processed))
        .catch((error) => reject(error));
    });
  }

  return {
    urls,
    getPromises,
    getOneYearAgo,
    getRssData,
  };
})();

module.exports = rssFeeds;
