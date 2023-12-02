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
