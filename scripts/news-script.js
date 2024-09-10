require("dotenv").config();
const fetch = require("node-fetch");
const firestore = require("./database-logic");
const { db } = require("./firebase-cjs");

const apiUrl = "https://newsapi.org/v2/top-headlines?";
const parameters = "country=us&category=technology";
const apiKey = process.env.NEWS_API_KEY;

function parseNewsData(array) {
    // Parses an array of news articles, extracting and formatting key information
    return array.map(article => {
        const date = new Date(article.publishedAt);  // Convert publishedAt to a Date object
        return {
            source: article.author,
            title: article.title,
            url: article.url,
            published: date.toLocaleString(),  // Format the published date for display
            timestamp: date.getTime()  // Store the timestamp for easier sorting
        };
    });
}

function getNewsData() {
    // Parses an array of news articles, extracting and formatting key information
    return fetch(`${apiUrl}${parameters}&apiKey=${apiKey}`)  // Make the API request
        .then(response => response.json())  // Parse the response as JSON
        .then(result => parseNewsData(result.articles))  // Parse and format the articles
        .catch(error => {
            console.error('Error fetching or parsing news data:', error);  // Log any errors
            throw error;  // Re-throw the error for handling in the caller
        });
}

function addNewsData(database) {
    // Adds news data to the database by querying existing items and adding new ones
    return firestore
        .queryItems(database, "news", "desc", 4000)  // Query existing news items
        .then((querySnapshot) => {
            firestore.setExistingUrls(querySnapshot);  // Set existing URLs to avoid duplicates
            return getNewsData();  // Fetch new news data from API
        })
        .then((parsedData) =>
            firestore.addToFirestore(database, "news", parsedData)  // Add parsed news data to Firestore
        )
        .then(() => (firestore.existingUrls.length = 0))  // Reset the existing URLs array
        .then(() => "News data successfully added.")  // Confirmation message
        .catch((error) => console.error(`Error: ${error}`));  // Handle errors
}

function queryAndDelete(database) {
    // Queries and deletes news data older than one month
    return firestore
        .queryItems(database, "news", "asc", 1000)  // Query old news items in ascending order
        .then((querySnapshot) => firestore.deleteOlderThanOneMonth(querySnapshot))  // Delete items older than one month
        .then(() => "Old data successfully deleted.")  // Confirmation message
        .catch((error) => console.error(`Error: ${error}`));  // Handle errors
}

function init(database) {
    // Initialize the process of deleting old data and adding new news data
    queryAndDelete(database)  // Delete old news data first
        .then((result) => {
            console.log(result);  // Log deletion result
            return addNewsData(database);  // Add new news data
        })
        .then((result) => {
            console.log(result);  // Log addition result
            console.log("Script executed successfully.");  // Final success message
        })
        .catch((error) => console.error(`Error: ${error}`))  // Handle any errors
        .finally(() => process.exit(0));  // Terminate the script
}

init(db)

