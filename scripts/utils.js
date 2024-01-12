const miscHelpers = (() => {
  function getCurrentMonth() {
    const today = new Date();
    return today.toLocaleString("default", {
      month: "long",
    });
  }

  function getCurrentYear() {
    const today = new Date();
    return today.getFullYear();
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

  function getOneMonthAgo() {
    const today = new Date();
    const oneMonthAgo = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      today.getDate()
    );
    return oneMonthAgo;
  }

  // function parseFeedData(array, category) {
  //   return array.items
  //     .filter((item) => new Date(item.published) > getOneMonthAgo())
  //     .map((item) => {
  //       const date = new Date(item.published);
  //       return {
  //         rssId: array.title + item.url,
  //         published: date.toLocaleString(),
  //         title: item.title,
  //         url: item.url,
  //         description:
  //           typeof item.description === "string"
  //             ? item.description
  //             : "No description available",
  //         source: array.title,
  //         category,
  //         timestamp: date.getTime(),
  //       };
  //     });
  // }

  function parseFeedData(array, category) {
    return array.items
      .filter((item) => new Date(item.pubDate) > getOneMonthAgo())
      .map((item) => {
        const date = new Date(item.pubDate);
        return {
          rssId: array.feed.title + item.link,
          published: date.toLocaleString(),
          title: item.title,
          url: item.link,
          description:
            typeof item.description === "string"
              ? item.description
              : "No description available",
          source: array.feed.title,
          category,
          timestamp: date.getTime(),
        };
      });
  }

  function parseSummaryData(array) {
    return array
      .filter((item) => new Date(item.pubDate) > getOneMonthAgo())
      .map((item) => {
        const date = new Date(item.pubDate);
        return {
          title: item.title,
          url: item.link,
          content: item.content,
          rssId: item.title + item.link,
          published: date.toLocaleString(),
          timestamp: date.getTime(),
          image: item.enclosure.link,
          summary: null,
        };
      });
  }

  // function parseSummaryData(array) {
  //   return array
  //     .filter((item) => new Date(item.published) > getOneMonthAgo())
  //     .map((item) => {
  //       const date = new Date(item.published);
  //       return {
  //         title: item.title,
  //         url: item.link,
  //         content: item.content,
  //         rssId: item.title + item.url,
  //         published: date.toLocaleString(),
  //         timestamp: date.getTime(),
  //         image: item.media.content.url,
  //         summary: null,
  //       };
  //     });
  // }

  return {
    getCurrentMonth,
    getCurrentYear,
    getOneYearAgo,
    getOneMonthAgo,
    parseFeedData,
    parseSummaryData,
  };
})();

module.exports = miscHelpers;
