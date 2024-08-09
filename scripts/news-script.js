require("dotenv").config();
const fetch = require("node-fetch");
const firestore = require("./database-logic");
const { db } = require("./firebase-cjs");

const apiUrl = "https://newsapi.org/v2/top-headlines?";
const parameters = "country=us&category=technology";
const apiKey = process.env.NEWS_API_KEY;

function parseNewsData(array) {
    return array.map(article => {
        const date = new Date(article.publishedAt);
        return {
            source: article.author,
            title: article.title,
            url: article.url,
            published: date.toLocaleString(),
            timestamp: date.getTime() // Used to simplify sorting.
        };
    });
}

function getNewsData() {
    return fetch(`${apiUrl}${parameters}&apiKey=${apiKey}`)
        .then(response => response.json())
        .then(result => parseNewsData(result.articles))
        .catch(error => {
            console.error('Error fetching or parsing news data:', error);
            throw error; // Re-throw the error so it can be handled by the caller.
        });
}

function addNewsData(database) {
    return firestore
        .queryItems(database, "news", "desc", 4000)
        .then((querySnapshot) => {
            firestore.setExistingUrls(querySnapshot);
            return getNewsData();
        })
        .then((parsedData) =>
            firestore.addToFirestore(database, "news", parsedData)
        )
        .then(() => (firestore.existingUrls.length = 0))
        .then(() => "News data successfully added.")
        .catch((error) => console.error(`Error: ${error}`));
}

function queryAndDelete(database) {
    return firestore
        .queryItems(database, "news", "asc", 1000)
        .then((querySnapshot) => firestore.deleteOlderThanOneMonth(querySnapshot))
        .then(() => "Old data successfully deleted.")
        .catch((error) => console.error(`Error: ${error}`));
}

function init(database) {
    queryAndDelete(database)
        .then((result) => {
            console.log(result);
            return addNewsData(database);
        })
        .then((result) => {
            console.log(result);
            console.log("Script executed successfully.");
        })
        .catch((error) => console.error(`Error: ${error}`))
        .finally(() => process.exit(0)); // Terminate script
}

init(db)

