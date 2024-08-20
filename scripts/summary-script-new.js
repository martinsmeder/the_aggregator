const getWikipediaText = require('./wikipedia-scraper');
const summarize = require("./huggingface");

// getWikipediaText()
//     .then((wikiText) => {
//         console.log('Title:', wikiText.title);
//         console.log('Original Body Text:', wikiText.bodyText);

//         return summarize({ inputs: wikiText.bodyText });
//     })
//     .then((summarizedText) => {
//         if (summarizedText.error) {
//             console.error('Error summarizing text:', summarizedText.error);
//         } else {
//             console.log('Summarized Body Text:', summarizedText[0].summary_text);
//         }
//     })
//     .catch(error => console.error('Error:', error));

// Dummy text to summarize
const dummyText = `
An agricultural robot is a robot deployed for agricultural purposes. 
The main area of application of robots in agriculture today is at the 
harvesting stage. Emerging applications of robots or drones in agriculture 
include weed control,[1][2][3] cloud seeding,[4] planting seeds, harvesting, 
environmental monitoring and soil analysis.[5][6] According to Verified Market 
Research, the agricultural robots market is expected to reach $11.58 billion 
by 2025.[7]
`;

summarize({ inputs: dummyText })
    .then((response) => {
        if (response.error) {
            console.error("Error from API:", response.error);
        } else {
            console.log("Summarized Text:", response[0].summary_text);
        }
    })
    .catch((error) => {
        console.error("Error:", error);
    });