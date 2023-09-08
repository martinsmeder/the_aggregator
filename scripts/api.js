require("dotenv").config();
const fetch = require("node-fetch");

const apiKey = process.env.NEWS_API_KEY;

const sourceUrl = `https://newsapi.org/v2/top-headlines?sources=associated-press&apiKey=${apiKey}`;
const categoryUrl = `https://newsapi.org/v2/top-headlines?country=us&category=technology&apiKey=${apiKey}`;

fetch(categoryUrl)
  .then((response) => response.json())
  .then((data) => {
    // const articleKeys = Object.keys(firstArticle);
    // console.log(articleKeys);
    const mapped = data.articles.map((article) => {
      if ((article.source = "associated-press")) return article;
    });
    mapped.forEach((article) => console.log(article));
  });

// id = associated-press
// sources article = ['source', 'author', 'title', 'description', 'url', 'urlToImage', 'publishedAt', 'content']
