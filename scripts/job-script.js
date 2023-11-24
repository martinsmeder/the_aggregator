require("dotenv").config();
const fetch = require("node-fetch");
const firestore = require("./database-logic");
const { testDb } = require("./firebase-test-cjs");

const jobScript = (() => {
  const url = "https://jooble.org/api/";
  const key = process.env.JOOBLE_API_KEY;

  const keywordsList = [
    "full stack",
    "front end",
    "back end",
    "web developer",
    "software engineer",
  ];
  const location = "USA";

  // Fetch data for a specific keyword
  const fetchData = (keywords) => {
    const params = {
      keywords, // The keyword to search for
      location, // The location for the job search
    };

    // Fetches data from the specified URL using the provided API key and parameters
    return fetch(url + key, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params), // Converts the parameters to JSON format
    })
      .then((response) => {
        if (response.ok) {
          return response.json(); // Parses the response JSON
        }
        throw new Error("Error:", response.statusText); // Throws an error for non-OK responses
      })
      .then((data) => data); // Returns the fetched data
  };

  // Fetch data for all keywords in the 'keywordsList'
  const fetchAllData = () => {
    // Create an array of promises for fetching data for each keyword
    const promises = keywordsList.map((keyword) => fetchData(keyword));

    // Executes all promises in parallel and waits for all of them to settle
    return Promise.allSettled(promises)
      .then((results) => {
        // Get the current month and year
        const today = new Date();
        const month = today.toLocaleString("default", {
          month: "long",
        });
        const year = today.getFullYear();

        // Maps the settled promises (results) to an array of objects containing keyword data
        const keywordData = results.map((result, index) => {
          if (result.status === "fulfilled") {
            return {
              name: keywordsList[index],
              count: result.value.totalCount || 0,
              month,
              year,
            };
            // eslint-disable-next-line no-else-return
          } else {
            return {
              name: keywordsList[index],
              count: 0,
              month,
              year,
            };
          }
        });

        return keywordData; // Returns the array of keyword data
      })
      .catch(
        (error) => console.error("Error:", error) // Handles any errors occurred during the process
      );
  };

  // Fetches data for all keywords and adds it to the Firestore database
  function init() {
    fetchAllData()
      .then((data) =>
        // Add fetched data to the Firestore database
        firestore.addToFirestore(testDb, "jobs", data).then(() => {
          console.log("Script executed successfully."); // Log success message
        })
      )
      .catch((error) => console.error("Error:", error))
      .finally(() => process.exit(0));
  }

  return {
    init,
  };
})();

jobScript.init();
