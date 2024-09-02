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

  return {
    getCurrentMonth,
    getCurrentYear,
    getOneYearAgo,
    getOneMonthAgo,
  };
})();

module.exports = miscHelpers;
