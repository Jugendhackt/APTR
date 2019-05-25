const request = require('request');
//var tokens = ['fb06bdc6579f1a78ff221eb4612f45de', '0eb13363c4c00d4dffc0e277c210d6af', '8aa1bbd679c357273cbcdfd9526e78d9', 'ffa19eb6e54c688f45a278c5905ef35b']
var tokens = ['fb06bdc6579f1a78ff221eb4612f45de', '5ed35e0f3f963a87d041bff8688628f5', '3779406152f3222a68d9ceeeb4f24dbb']

exports.getStationInfo = function(id, i) {
    return new Promise((resolve, reject) => {
        request({
            //url: 'https://api.deutschebahn.com/stada/v2/stations/'+brokenObject.objectId,
            url: 'https://api.deutschebahn.com/stada/v2/stations/'+id,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + tokens[i%3],
            },
            method: 'GET',
            json: false,
        }, function(error, response, body) {
            if(error) reject(error);
            else {
                try {
                    resolve(JSON.parse(body).result[0].evaNumbers[0].number);
                } catch (e) {
                    console.log(JSON.parse(body));
                    reject(e + i%3);
                }
            }
        });
    })
}
