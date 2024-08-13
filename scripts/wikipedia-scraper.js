const axios = require('axios');
const cheerio = require('cheerio');

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
        })
}

getLinks().then(links => console.log(links))
