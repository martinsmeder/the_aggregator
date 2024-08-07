require("dotenv").config();
const fetch = require("node-fetch");

const apiUrl = "https://newsapi.org/v2/top-headlines?"
const parameters = "country=us&category=technology"
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

fetch(`${apiUrl}${parameters}&apiKey=${apiKey}`)
    .then(response => response.json())
    .then(result => {
        const articles = parseNewsData(result.articles);
        console.log(articles);
    })
    .catch(error => console.error('Error:', error));

