// https://openai.com/blog/rss.xml
// https://www.deepmind.com/blog/rss.xml
// https://news.mit.edu/topic/mitmachine-learning-rss.xml
// API: apnews, bbc

const rssFeedUrl = "https://openai.com/blog/rss.xml";
const apiUrl = `https://rss-to-json-serverless-api.vercel.app/api?feedURL=${rssFeedUrl}`;

// Make the GET request to the API
fetch(apiUrl)
  .then((response) => response.json())
  .then((data) => {
    console.log(data);

    // Assuming data.items is an array of articles
    const item = data.items[0]; // Select the first item for example

    // Set article title, author, date, and content
    document.getElementById("article-title").textContent = item.title;
    document.getElementById("article-description").textContent =
      item.description;
    document.getElementById("article-date").textContent = new Date(
      item.published
    ).toLocaleDateString();
  })
  .catch((error) => {
    console.error("An error occurred:", error);
  });
