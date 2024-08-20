require("dotenv").config();
const fetch = require("node-fetch");

const API_TOKEN = process.env.HF_API_TOKEN;

const bart =
  "https://api-inference.huggingface.co/models/facebook/bart-large-cnn";

function summarize(data) {
  return fetch(bart, {
    headers: { Authorization: `Bearer ${API_TOKEN}` },
    method: "POST",
    body: JSON.stringify(data),
  }).then((response) => response.json());
}

module.exports = summarize;

// Dummy text to summarize
const dummyText = `
    An agricultural robot is a robot deployed for agricultural purposes. 
    The main area of application of robots in agriculture today is at the 
    harvesting stage. Emerging applications of robots or drones in agriculture 
    include weed control,[1][2][3] cloud seeding,[4] planting seeds, harvesting, 
    environmental monitoring and soil analysis.[5][6] According to Verified Market 
    Research, the agricultural robots market is expected to reach $11.58 billion 
    by 2025.[7]
`;

summarize({ inputs: dummyText })
  .then((response) => {
    if (response.error) {
      console.error("Error from API:", response.error);
    } else {
      console.log("Summarized Text:", response[0].summary_text);
    }
  })
  .catch((error) => {
    console.error("Error:", error);
  });
