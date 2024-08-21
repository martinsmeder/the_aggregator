const firestore = require("./database-logic");
const { testDb } = require("./firebase-test-cjs");
const getWikipediaText = require('./wikipedia-scraper');
const summarize = require("./huggingface");

function addSummaryData() {
    return getWikipediaText()
        .then((wikiText) => {
            return summarize({ inputs: wikiText.bodyText })
                .then((summarizedText) => {
                    const summaryArray = []
                    const summary = {
                        title: wikiText.title,
                        summary: summarizedText[0].summary_text
                    };
                    summaryArray.push(summary)
                    return summaryArray;
                });
        })
        .then((summary) => firestore.addToFirestore(testDb, "summaries", summary))
        .catch(error => console.error('Error:', error));
}

addSummaryData()

// duplication avoidance:
// if title already exist in database, do nothing
// otherwise, add to database 