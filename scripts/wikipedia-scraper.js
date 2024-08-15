const axios = require('axios');
const cheerio = require('cheerio');
const firestore = require("./database-logic");
const { testDb } = require("./firebase-test-cjs");

// Add check for previously scraped links when choosing link to scrape
// When visited links == counted links, clear visited link collection and start over

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
                bodyText
            };
        })
        .catch(error => {
            console.error('Error scraping the article:', error);
            throw error;
        });
}

function getUniqueLink(links, visitedLinks) {
    return new Promise((resolve) => {
        let randomLink = getRandomLink(links);

        while (visitedLinks.includes(randomLink)) { // If randomlink already exist...
            randomLink = getRandomLink(links); // ...keep generating random links.
        }

        resolve(randomLink); // Resolve promise when unique link is found.
    });
}

getLinks()
    .then(links => {
        console.log("Number of links: " + links.length);
        console.log('Scraping text from a random link...');

        return firestore.queryItems(testDb, 'visited', 'asc', 100)
            .then(querySnapshot => firestore.getVisitedLinks(querySnapshot))
            .then(visitedLinks => {
                return getUniqueLink(links, visitedLinks);
            })
            .then(uniqueLink => {
                return firestore.addVisitedLinkToFirestore(testDb, uniqueLink)
                    .then(() => uniqueLink);
            });
    })
    .then(uniqueLink => {
        return scrapeText(uniqueLink);
    })
    .then(result => {
        console.log('Title:', result.title);
        console.log('Body Text:', result.bodyText);
    })
    .catch(error => console.error('Error:', error));
