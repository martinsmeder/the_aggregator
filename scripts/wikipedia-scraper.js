const axios = require('axios');
const cheerio = require('cheerio');
const firestore = require("./database-logic");
const { testDb } = require("./firebase-test-cjs");

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

function init() {
    return getLinks()
        .then(links => {
            console.log("Number of links: " + links.length);
            console.log('Scraping text from a random link...');

            let querySnapshot;

            return firestore.queryItems(testDb, 'visited', 'asc', 1000)
                .then(snapshot => {
                    querySnapshot = snapshot;
                    return firestore.getVisitedLinks(querySnapshot);
                })
                .then(visitedLinks => {
                    console.log(`Visited Links: ${visitedLinks.length}`);
                    console.log(`Total Links: ${links.length}`);

                    if (visitedLinks.length >= links.length) {
                        console.log('Clearing Firestore...');
                        return firestore.clearFirestore(querySnapshot)
                            .then(() => {
                                return getUniqueLink(links, []);
                            });
                    } else {
                        return getUniqueLink(links, visitedLinks);
                    }
                })
                .then(uniqueLink => {
                    console.log(`Found Unique Link: ${uniqueLink}`);
                    return firestore.addVisitedLinkToFirestore(testDb, uniqueLink)
                        .then(() => uniqueLink);
                })
                .then(uniqueLink => {
                    console.log(`Scraping text from: ${uniqueLink}`);
                    return scrapeText(uniqueLink);
                })
                .then(result => {
                    console.log('Title:', result.title);
                    console.log('Body Text:', result.bodyText);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        });
}

init();

// function runSequentialTests(times) {
//     let promiseChain = Promise.resolve();

//     for (let i = 0; i < times; i++) {
//         promiseChain = promiseChain.then(() => {
//             console.log(`Running test iteration: ${i + 1}`);
//             return init();
//         });
//     }

//     promiseChain.then(() => {
//         console.log('All tests completed successfully.');
//     }).catch(error => {
//         console.error('Error during testing:', error);
//     });
// }

// // Run the tests sequentially
// runSequentialTests(100);

// firestore.queryItems(testDb, "visited", "asc", 1000)
//     .then(querySnapshot => firestore.clearFirestore(querySnapshot))
//     .catch(error => console.error(error))

// getLinks()
//     .then(allLinks => allLinks.forEach(link => firestore.addVisitedLinkToFirestore(testDb, link)))
//     .catch(error => console.error(error))