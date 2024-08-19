const getWikipediaText = require('./wikipedia-scraper');
const summarize = require("./huggingface");

getWikipediaText()
    .then((wikiText) => {
        console.log('Title:', wikiText.title);
        console.log('Original Body Text:', wikiText.bodyText);

        return summarize({ inputs: wikiText.bodyText });
    })
    .then((summarizedText) => {
        if (summarizedText.error) {
            console.error('Error summarizing text:', summarizedText.error);
        } else {
            console.log('Summarized Body Text:', summarizedText[0].summary_text);
        }
    })
    .catch(error => console.error('Error:', error));