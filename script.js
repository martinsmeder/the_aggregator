const rssFeedUrl = 'https://news.mit.edu/topic/mitmachine-learning-rss.xml';
const apiUrl = `https://rss-to-json-serverless-api.vercel.app/api?feedURL=${rssFeedUrl}`;

// Make the GET request to the API
fetch(apiUrl)
  .then((response) => response.json())
  .then((data) => {
    console.log(data);

    // Assuming data.items is an array of articles
    const item = data.items[2]; // Select the first item for example

    // Set article title, author, date, and content
    document.getElementById('article-title').textContent = item.title;
    document.getElementById('article-author').textContent = item.author;
    document.getElementById('article-date').textContent = new Date(
      item.published
    ).toLocaleDateString();
    document.getElementById('article-content').innerHTML = item.content;

    // Set article image
    const articleImage = document.getElementById('article-image');
    if (item.media && item.media.content && item.media.content.url) {
      articleImage.src = item.media.content.url;
      articleImage.alt = item.title; // Use article title as image alt text
    }
  })
  .catch((error) => {
    console.error('An error occurred:', error);
  });
