const axios = require('axios');
const cheerio = require('cheerio');
const firestore = require("./database-logic");
const { db } = require("./firebase-cjs");
const summarize = require("./huggingface");

function getLinks() {
    // Fetches technology links from Wikipedia's emerging technologies page
    const url = 'https://en.wikipedia.org/wiki/List_of_emerging_technologies';  // URL to scrape

    return axios.get(url)  // Make an HTTP GET request to the Wikipedia page
        .then(response => cheerio.load(response.data))  // Load the HTML response into Cheerio for parsing
        .then($ => {
            const allLinks = [];  // Array to store extracted links
            const tables = $('#mw-content-text > .mw-parser-output > table');  // Select tables containing technologies

            tables.each((tableIndex, tableElement) => {
                // Iterate over each row in the table
                $(tableElement).find('tbody > tr').each((rowIndex, rowElement) => {
                    const linkElement = $(rowElement).find('td').first().find('a');  // Find the first link in each row
                    if (linkElement.length) {
                        const link = 'https://en.wikipedia.org' + linkElement.attr('href');  // Construct the full URL
                        allLinks.push(link);  // Add the link to the list
                    }
                });
            });

            return allLinks;  // Return the array of links
        })
        .catch(error => {
            console.error('Error fetching the technology links:', error);  // Handle any errors
            throw error;  // Re-throw the error to be handled by the caller
        });
}

function getRandomLink(links) {
    if (links.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * links.length);
    return links[randomIndex];
}

function scrapeText(url) {
    // Scrapes the title and main text from a Wikipedia article
    return axios.get(url)  // Fetch the HTML content of the page
        .then(response => cheerio.load(response.data))  // Load the HTML into Cheerio for parsing
        .then($ => {
            const title = $('#firstHeading > span').text().trim();  // Extract the page title

            const paragraphs = [];  // Array to store text from paragraphs
            const contentDiv = $('#mw-content-text > div.mw-content-ltr.mw-parser-output');  // Select the content area

            const endDivClass = 'mw-heading mw-heading2';  // Class that marks the end of the main content

            let currentElement = contentDiv.children().first();  // Start from the first child of the content div
            // Iterate through elements until the endDivClass is found
            while (currentElement.length && !currentElement.hasClass(endDivClass)) {
                if (currentElement.is('p')) {  // If the element is a paragraph
                    paragraphs.push(currentElement.text().trim());  // Add its text to the paragraphs array
                }
                currentElement = currentElement.next();  // Move to the next element
            }

            const bodyText = paragraphs.join('\n\n');  // Combine all paragraphs into a single string

            return {
                title,  // Return the scraped title
                bodyText,  // Return the scraped body text
                url  // Include the URL for reference
            };
        })
        .catch(error => {
            console.error('Error scraping the article:', error);  // Log any errors encountered
            throw error;  // Re-throw the error for the caller to handle
        });
}

function getWikipediaText() {
    // Extracts text from links that hasnt been summarized
    return Promise.all([
        getLinks(),  // Fetch all Wikipedia links
        firestore.queryItems(db, 'summaries', 'asc', 1000)  // Query previously stored summaries
    ])
        .then(([links, snapshot]) => {
            // Extract URLs from the stored summaries
            const storedUrls = snapshot.docs.map(doc => doc.data().url);
            // Filter out links that have already been summarized
            const filteredLinks = links.filter(link => !storedUrls.includes(link));

            // If no new links are found, log a message and return null
            if (filteredLinks.length === 0) {
                console.log("All links have already been summarized.");
                return null;
            }

            // Select a random link from the filtered list and scrape its text
            const randomLink = getRandomLink(filteredLinks);
            return scrapeText(randomLink);
        })
        .catch(error => {
            // Handle and log any errors that occur
            console.error('Error:', error);
        });
}

function addSummaryData(wikiText) {
    // Adds a summarized Wikipedia article to the 'summaries' collection in Firestore
    if (!wikiText) {
        return;  // Exit if there's no Wikipedia text to summarize
    }

    return summarize({ inputs: wikiText.bodyText })  // Use a summarization API on the article text
        .then(summarizedText => {
            // Create a summary object with the title, summarized text, and original URL
            const summary = {
                title: wikiText.title,
                summary: summarizedText[0].summary_text,
                url: wikiText.url
            };
            // Add the summary to Firestore
            return firestore.addToFirestore(db, "summaries", [summary]);
        })
        .catch(error => {
            // Log any errors encountered
            console.error('Error:', error);
        });
}

function init() {
    // Initializes the process of fetching Wikipedia text and adding its summary to Firestore
    return getWikipediaText()  // Fetch and scrape a random Wikipedia article
        .then(wikiText => {
            return addSummaryData(wikiText);  // Summarize and add the article to Firestore
        })
        .catch(error => {
            // Handle and log any errors that occur
            console.error('Error:', error);
        })
        .finally(() => process.exit(0));  // Exit the process once everything is done
}

init()


