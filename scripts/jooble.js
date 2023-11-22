require("dotenv").config();
const fetch = require("node-fetch");

const url = "https://jooble.org/api/";
const key = process.env.JOOBLE_API_KEY;

const keywordsList = [
  "full stack",
  "web developer",
  "software engineer",
  "data analyst",
  "UX/UI designer",
];
const location = "USA";

const fetchData = (keywords) => {
  const params = {
    keywords,
    location,
  };

  return fetch(url + key, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  }).then((response) => {
    if (response.ok) {
      return response.json();
    }
    throw new Error("Error:", response.statusText);
  });
};

const fetchAllData = () => {
  const promises = keywordsList.map((keyword) => fetchData(keyword));

  Promise.allSettled(promises)
    .then((results) => {
      results.forEach((result, index) => {
        if (result.status === "fulfilled") {
          console.log(
            `Data for keyword "${keywordsList[index]}":`,
            result.value
          );
        } else {
          console.error(
            `Error for keyword "${keywordsList[index]}":`,
            result.reason.message
          );
        }
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

fetchAllData();
