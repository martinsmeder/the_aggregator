const axios = require('axios');
const cheerio = require('cheerio');
const firestore = require("./database-logic");
const { db } = require("./firebase-cjs");
const summarize = require("./huggingface");

function getLinks() {
    const url = 'https://en.wikipedia.org/wiki/List_of_emerging_technologies';

    return axios.get(url)
        .then(response => cheerio.load(response.data))
        .then($ => {
            const allLinks = [];
            const tables = $('#mw-content-text > .mw-parser-output > table');

            tables.each((tableIndex, tableElement) => {
                $(tableElement).find('tbody > tr').each((rowIndex, rowElement) => {
                    const linkElement = $(rowElement).find('td').first().find('a');
                    if (linkElement.length) {
                        const link = 'https://en.wikipedia.org' + linkElement.attr('href');
                        allLinks.push(link);
                    }
                });
            });

            return allLinks;
        })
        .catch(error => {
            console.error('Error fetching the technology links:', error);
            throw error;
        });
}

function getRandomLink(links) {
    if (links.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * links.length);
    return links[randomIndex];
}

function scrapeText(url) {
    return axios.get(url)
        .then(response => cheerio.load(response.data))
        .then($ => {
            const title = $('#firstHeading > span').text().trim();

            const paragraphs = [];
            const contentDiv = $('#mw-content-text > div.mw-content-ltr.mw-parser-output');

            const endDivClass = 'mw-heading mw-heading2';

            let currentElement = contentDiv.children().first();
            while (currentElement.length && !currentElement.hasClass(endDivClass)) {
                if (currentElement.is('p')) {
                    paragraphs.push(currentElement.text().trim());
                }
                currentElement = currentElement.next();
            }

            const bodyText = paragraphs.join('\n\n');

            return {
                title,
                bodyText,
                url
            };
        })
        .catch(error => {
            console.error('Error scraping the article:', error);
            throw error;
        });
}

function getWikipediaText() {
    return Promise.all([getLinks(), firestore.queryItems(db, 'summaries', 'asc', 1000)])
        .then(([links, snapshot]) => {
            const storedUrls = snapshot.docs.map(doc => doc.data().url);
            const filteredLinks = links.filter(link => !storedUrls.includes(link));

            if (filteredLinks.length === 0) {
                console.log("All links have already been summarized.");
                return null;
            }

            const randomLink = getRandomLink(filteredLinks);
            return scrapeText(randomLink);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function addSummaryData(wikiText) {
    if (!wikiText) {
        return;
    }

    return summarize({ inputs: wikiText.bodyText })
        .then(summarizedText => {
            const summary = {
                title: wikiText.title,
                summary: summarizedText[0].summary_text,
                url: wikiText.url
            };
            return firestore.addToFirestore(db, "summaries", [summary]);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function init() {
    return getWikipediaText()
        .then(wikiText => {
            return addSummaryData(wikiText);
        })
        .catch(error => {
            console.error('Error:', error);
        })
        .finally(() => process.exit(0));
}

init()


