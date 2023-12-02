// /* eslint-disable no-undef */
const jobScript = require("./job-script");

// const keywords = ["web developer", "plumber"];

// describe("fetchAllData function", () => {
//   it("should fetch data for each keyword", () => {
//     jobScript.fetchAllData(keywords).then((data) => {
//       expect(data.length).toEqual(2);
//       expect(data[0].name).toEqual("web developer");
//       expect(data[1].name).toEqual("plumber");
//     });
//   });

//   it("should include correct properties", () => {
//     const correctData = ["name", "count", "month", "year"];

//     jobScript.fetchAllData(keywords).then((data) => {
//       data.forEach((item) => expect(Object.keys(item)).toEqual(correctData));
//     });
//   });

//   it("get correct count", () => {
//     jobScript.fetchAllData(keywords).then((data) => {
//       expect(data[0].count).toBeGreaterThan(data[1].count);
//     });
//   });
// });

const url = "https://joooooooooooble.org/api/";
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
const fetchAllData = (arr) => {
  // Create an array of promises for fetching data for each keyword
  const promises = arr.map((keyword) => fetchData(keyword));

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
            name: arr[index],
            count: result.value.totalCount || 0,
            month,
            year,
          };
          // eslint-disable-next-line no-else-return
        } else {
          return {
            name: arr[index],
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

// Returns array with 0 count when it should log the error from using the wrong
// url...
fetchAllData(keywordsList)
  .then((result) => result.forEach((item) => console.log(item)))
  .catch((error) => console.error(error));
