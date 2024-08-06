require("dotenv").config();
const fetch = require("node-fetch");
const firestore = require("./database-logic");

const key = process.env.NEWS_API_KEY;

fetch(`https://newsapi.org/v2/top-headlines?category=technology&apiKey=${key}`)
    .then(response => response.json())
    .then(result => console.log(result))

// Get specific category from specific source possible?
// Otherwise above soultion with database.  