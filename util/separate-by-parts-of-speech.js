var separateByPartsOfSpeech = function(word, docs) {
    var mappedWordResponse = {word: word};
    for (let i = 0; i < docs.length; i++) {
        if (mappedWordResponse[docs[i].partOfSpeech]) {
            mappedWordResponse[docs[i].partOfSpeech].push(docs[i]);
        } else {
            mappedWordResponse[docs[i].partOfSpeech] = [docs[i]];
        }
    }
    return mappedWordResponse
}

module.exports = separateByPartsOfSpeech;
