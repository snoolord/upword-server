const scrapeIt = require('scrape-it');
const cheerio = require('cheerio');
var Promise = require("bluebird");

var scrapeForSynonyms = function(word, req, res) {
    // var $ = cheerio.load('http://www.thesaurus.com/browse/feed?s=t')
    // let synonyms = scrapeIt.scrapeHTML($,{
    //     title: {
    //         selector: '.main h1'
    //     }
    // });
    var synonyms;
    var promise = scrapeIt("http://www.thesaurus.com/browse/feed?s=t", {
            synonynms: {
                listItem: '.relevancy-list ul li a .text'
            }
        })
    promise = Promise.bind(promise, synonyms);
    promise.then(page => {
        synonyms = page;
    })

    console.log(synonyms);

}

scrapeForSynonyms();
module.exports = scrapeForSynonyms;
