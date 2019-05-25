const request = require('request');

exports.getStationInfo = function(id) {
    return new Promise((resolve, reject) => {
        request({
            //url: 'https://api.deutschebahn.com/stada/v2/stations/'+brokenObject.objectId,
            url: 'https://api.deutschebahn.com/stada/v2/stations/'+id,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer fb06bdc6579f1a78ff221eb4612f45de',
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
                    reject(e);
                }
            }
        });
    })
}
