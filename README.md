![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)

Live demo: https://the-aggregator.vercel.app/

The Aggregator is a simple aggregator app built with React, including React Router, and backed by Firebase Cloud Firestore. The app is divided into three main sections: Summaries, News, and Trends.

Summaries
- Scrapes links from Wikipedia's "Emerging Technologies" list.
- Generates summaries using an AI model hosted on Hugging Face.
- Stores the summaries in a Firestore database.

News
- Fetches the latest technology news using the News API.

Trends
- Retrieves job data from the Jooble API.
- Displays the data on a monthly line chart.
