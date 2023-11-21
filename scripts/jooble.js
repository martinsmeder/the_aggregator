require("dotenv").config();
const fetch = require("node-fetch");

const url = "https://jooble.org/api/";
const key = process.env.JOOBLE_API_KEY;
const params = {
  keywords: "sales",
  location: "USA",
};

const fetchData = async () => {
  try {
    const response = await fetch(url + key, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data);
    } else {
      console.error("Error:", response.statusText);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

fetchData();
