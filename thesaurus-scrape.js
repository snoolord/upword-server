const scrapeIt = require('scrape-it');



scrapeIt("http://www.thesaurus.com/browse/feed?s=t", {
    synonynms: {
        listItem: '.relevancy-list ul li a .text'
    }
}).then(page => {
    console.log(page);
});
