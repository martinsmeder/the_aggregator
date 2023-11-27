require("dotenv").config();
const fetch = require("node-fetch");

const apiKey = process.env.NEWS_API_KEY;

const url = `https://newsapi.org/v2/top-headlines/sources?country=us&apiKey=${apiKey}`;

fetch(url)
  .then((response) => response.json())
  .then((data) => data.sources.forEach((source) => console.log(source)));

// ============================ ID's to filter ===============================
//   abc-news (7/10 - General news)
//   al-jazeera-english (8/10 - International news, Middle East focus)
//   ars-technica (9/10 - Technology news)
//   associated-press (9/10 - General news, global coverage)
//   axios (8/10 - General news, concise reporting)
//   bloomberg (9/10 - Business and financial news)
//   business-insider (8/10 - Business and technology focus)
//   cbs-news (8/10 - General news)
//   cnn (7/10 - General news)
//   engadget (8/10 - Consumer electronics and tech)
//   entertainment-weekly (6/10 - Entertainment news)
//   espn (8/10 - Sports news)
//   fortune (8/10 - Business and finance)
//   google-news (8/10 - Aggregated news from various sources)
//   hacker-news (6/10 - Tech community, startups)
//   ign (7/10 - Gaming news)
//   mashable (7/10 - Technology, digital culture)
//   medical-news-today (7/10 - Health and medical news)
//   msnbc (7/10 - Liberal bias, political news)
//   national-geographic (9/10 - Science, nature)
//   nbc-news (7/10 - General news)
//   new-scientist (8/10 - Science and technology)
//   newsweek (7/10 - General news, analysis)
//   new-york-magazine (7/10 - Culture, lifestyle)
//   next-big-future (8/10 - Futurism, technology advancements)
//   politico (8/10 - Political news)
//   polygon (7/10 - Gaming and entertainment)
//   recode (8/10 - Technology and media)
//   reuters (9/10 - Global news agency)
//   techcrunch (9/10 - Tech startups, innovation)
//   techradar (8/10 - Technology reviews and news)
//   the-huffington-post (7/10 - Liberal bias, opinionated)
//   the-next-web (8/10 - Internet technology, startups)
//   the-verge (8/10 - Technology, culture)
//   the-wall-street-journal (9/10 - Business and financial news)
//   the-washington-post (8/10 - General news, analysis)
//   wired (8/10 - Technology, culture)
