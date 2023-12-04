require("dotenv").config();
const fetch = require("node-fetch");
const firestore = require("./database-logic");
const miscHelpers = require("./utils");
// const { testDb } = require("./firebase-test-cjs");
const { db } = require("./firebase-cjs");

const jobScript = (() => {
  const url = "https://jooble.org/api/";
  const key = process.env.JOOBLE_API_KEY;

  const keywordsList = [
    "full stack developer",
    "front end developer",
    "back end developer",
    "data engineer",
    "machine learning engineer",
  ];
  const location = "USA";

  // Fetch data for a specific keyword
  const fetchData = (keywords) => {
    const params = {
      keywords,
      location,
    };

    // Fetches data from the specified URL using the provided API key and parameters
    return fetch(url + key, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Error:", response.statusText);
      })
      .catch((error) => console.error(error));
  };

  // Fetch data for all keywords in the 'keywordsList'
  const fetchAllData = (arr) => {
    // Create an array of promises for fetching data for each keyword
    const promises = arr.map((keyword) => fetchData(keyword));
    // Executes all promises in parallel and waits for all of them to settle
    return Promise.allSettled(promises)
      .then((results) => {
        // Maps the settled promises (results) to an array of objects containing keyword data
        const keywordData = results.map((result, index) => {
          if (result.status === "fulfilled") {
            return {
              name: arr[index],
              count: result.value.totalCount,
              month: miscHelpers.getCurrentMonth(),
              year: miscHelpers.getCurrentYear(),
            };
          }

          throw new Error(`Fetch error: ${result.reason}`);
        });

        return keywordData;
      })
      .catch((error) => console.error("Error:", error));
  };

  // Fetches data for all keywords and adds it to the Firestore database
  function init(database) {
    fetchAllData(keywordsList)
      .then((data) =>
        // Add fetched data to the Firestore database
        firestore.addToFirestore(database, "jobs", data).then(() => {
          console.log("Script executed successfully.");
        })
      )
      .catch((error) => console.error("Error:", error))
      .finally(() => process.exit(0));
  }

  return {
    fetchData,
    fetchAllData,
    init,
  };
})();

jobScript.init(db);

module.exports = jobScript;
