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
