const miscHelpers = (() => {
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

  function parseFeedData(array, category, isReddit) {
    return array.items
      .filter((item) => new Date(item.published) > getOneYearAgo())
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
  }

  function parseSummaryData(array) {
    return array
      .filter((item) => new Date(item.published) > getOneMonthAgo())
      .map((item) => {
        const date = new Date(item.published);
        return {
          title: item.title,
          url: item.link,
          content: item.content,
          rssId: item.title + item.url,
          published: date.toLocaleString(),
          timestamp: date.getTime(),
          image: item.media.content.url,
          summary: null,
        };
      });
  }

  return {
    getOneYearAgo,
    getOneMonthAgo,
    parseFeedData,
    parseSummaryData,
  };
})();

module.exports = miscHelpers;
