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
      url: "https://www.notaworkingwebsite.com/blog/rss",
      isReddit: false,
    },
    // {
    //   category: "ai",
    //   url: "https://www.reddit.com/r/artificial/top/.rss?limit=500",
    //   isReddit: true,
    // },
    // {
    //   category: "programming",
    //   url: "https://www.reddit.com/r/programming/top/.rss?limit=500",
    //   isReddit: true,
    // },
    // {
    //   category: "programming",
    //   url: "http://blog.stackoverflow.com/feed/",
    //   isReddit: false,
    // },
    // {
    //   category: "programming",
    //   url: "http://githubengineering.com/atom.xml",
    //   isReddit: false,
    // },
    // {
    //   category: "science",
    //   url: "https://www.reddit.com/r/science/top/.rss?limit=500",
    //   isReddit: true,
    // },
    // {
    //   category: "science",
    //   url: "http://newsrss.bbc.co.uk/rss/newsonline_world_edition/science/nature/rss.xml",
    //   isReddit: false,
    // },
    // {
    //   category: "science",
    //   url: "http://www.sciencedaily.com/rss/mind_brain/neuroscience.xml",
    //   isReddit: false,
    // },
    // {
    //   category: "business",
    //   url: "https://www.reddit.com/r/business/top/.rss?limit=500",
    //   isReddit: true,
    // },
    // {
    //   category: "business",
    //   url: "http://newsrss.bbc.co.uk/rss/newsonline_world_edition/business/rss.xml",
    //   isReddit: false,
    // },
    // {
    //   category: "business",
    //   url: "http://www.forbes.com/entrepreneurs/index.xml",
    //   isReddit: false,
    // },
    // {
    //   category: "world",
    //   url: "https://www.reddit.com/r/worldnews/top/.rss?limit=500",
    //   isReddit: true,
    // },
    // {
    //   category: "world",
    //   url: "http://feeds.bbci.co.uk/news/world/rss.xml",
    //   isReddit: false,
    // },
  ];

  function getPromises() {
    const api = "https://rss-to-json-serverless-api.vercel.app/api?feedURL=";
    const promises = urls.map((source) => fetch(api + source.url));
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
          isReddit: isReddit,
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
          category: category,
          timestamp: date.getTime(),
        };
      });

    return parsedData;
  }

  function getRssData() {
    return new Promise((resolve, reject) => {
      const promises = getPromises();

      Promise.all(promises)
        .then((responses) =>
          Promise.all(responses.map((response) => response.json()))
        )
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
    getPromises,
    getOneYearAgo,
    getRssData,
  };
})();

const promises = rssFeeds.getPromises();

Promise.allSettled(promises).then((responses) =>
  responses.forEach((response) => console.log(response))
);

module.exports = rssFeeds;
