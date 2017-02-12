var fs = require('fs');
var axios = require('axios');

var readLines = function(){
    var array = fs.readFileSync('usage.txt').toString().split("\n");
    var config = { proxy: { port: 3000} };
    for (let i = 105; i < 110; i++) {
        console.log(array[i]);
        axios
            .post('/word', {
            word: array[i]
            }, config)
            .then(function(response){
            console.log(response.data);
            })
            .catch(function(error){
            console.log(error);
            })
    }
}
readLines();
