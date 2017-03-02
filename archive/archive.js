x(`http://www.thesaurus.com/browse/best?s=t`, {
    partOfSpeech: '.synonym-description .txt',
    description: '.ttl'
})(function(error, word){
    word.word = req.body.word;
    console.log(word);
    x('http://www.thesaurus.com/browse/hello?s=t', ['.relevancy-list ul li a .text'])(function(
        e, syns){
            console.log(syns);
            // var synSchemas = [];
            // for (let i = syns.length-1; i >= 0; i--) {
            //     x('http://www.dictionary.com/browse/any?s=t', {
            //         partOfSpeech: '.luna-data-header .dbox-pg span span'
            //     })(function(er, synData){
            //         console.log(synData, "SYNDATA");
            //     })
            // }
        })
    })

    / async.each(wordsWithSynonyms, processWord, function(err){
    //     console.log("this is after the synonymss are saved");
    //     var formattedWords = [];
    //     async.each(wordsWithSynonyms, function(word, callbac) {
    //         console.log(word.word);
    //         console.log("FINALLY SAVING it !!");
    //         var formattedWord = new Word(word);
    //         console.log(formattedWord);
    //         formattedWords.push(formattedWord)
    //         formattedWord.save(callbac);
    //
    //     }, function(err){
    //         let mappedWordResponse = {word: req.body.word};
    //         for (let i = 0; i < formattedWords.length; i++) {
    //             if (mappedWordResponse[formattedWords[i].partOfSpeech]) {
    //                 mappedWordResponse[formattedWords[i].partOfSpeech].push(formattedWords[i]);
    //             } else {
    //                 mappedWordResponse[formattedWords[i].partOfSpeech] = [formattedWords[i]];
    //             }
    //         }
    //         res.status = 201;
    //         res.json(mappedWordResponse)
    //     });
    // });
3/1/2017
    // perform first api call to get the word
    // axios
    //     .get(baseUrl + queryString + apiKey)
    //     .then(function(response) {
    //         var wordsWithSynonyms;
    //         // I separated the words by part of speech and formatted it
    //         parseString(response.data, function(err, result){
    //             var parsedJson =
    //                 JSON.parse(JSON.stringify(result.entry_list));
    //             if (parsedJson.suggestion) {
    //                 res.status = 404;
    //                 var formattedSuggestion = {
    //                     word: req.body.word,
    //                     related: parsedJson.suggestion
    //                 }
    //                 var newSuggested = new Suggested(formattedSuggestion)
    //                 newSuggested.save(function(err) {
    //                 })
    //                 res.json({related: parsedJson.suggestion});
    //             } else {
    //                 wordsWithSynonyms =
    //                 util.convertXMLResultsToWords(req.body.word, result);
    //             }
    //         });
    //         /* if wordsWithSynonyms is populated then I can save all the words
    //          to the database*/
    //         if (wordsWithSynonyms) {
    //             var formattedWords = [];
    //             // I use async.each so that I can wait for all the saves to process
    //             // then the formattedWords are mapped to a response json
    //             async.each(wordsWithSynonyms, function(word, callback) {
    //                 var formattedWord = new Word(word);
    //                 formattedWord.save(function(err) {
    //                     if (err) return next(err);
    //                     formattedWords.push(formattedWord)
    //                     callback();
    //                 });
    //             }, function(err) {
    //                 let mappedWordResponse = separateByPartsOfSpeech(req.body.word, formattedWords);
    //                 res.status = 201;
    //                 res.json(mappedWordResponse);
    //             })
    //         }
    //     }).catch(function(error) {
    //         console.log(error);
    //     });
