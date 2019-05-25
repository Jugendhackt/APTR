const express = require("express");
const cors = require('cors');
const bodyParser = require("body-parser");
const curl = require("curl");
const csv = require('csv-parser')
const fs = require('fs')
const BrokenObject = require("./BrokenObject.js");
const port = 1337;


/*** API ***/
var app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(port, function () {
    console.log('API listening on Port ' + port);
    console.log('It is available at http://localhost:' + port);
})

app.get('/', function (req, res) {
    res.send("API-Schnittstelle");
    res.status(200).end();
});

app.get('/getAllDisruptions', function (req, res) {
    res.send(JSON.stringify(brokenObjects))
    res.status(200).end();
});

app.get('/objectIsDisrupted/:objectId', function (req, res) {
    console.log(req.params.objectId);
    brokenObjects.forEach(obj => {
        if (obj.objectId == req.params.objectId) {
            res.send(JSON.stringify(obj))
        }
    })
    res.send(JSON.stringify({}))
    res.status(200).end();
})

app.get('/getDisruptionCount', function (req, res) {
    res.send(brokenObjects.length + "");
    res.status(200).end();
});

/*** CRAWLER ***/
var brokenObjects = [];

function refreshDisruptions() {
    getJSONFromURL("https://elescore.de/api/disruptions")
        .then((data) => {
            var tempObjs = [];

            data.forEach(facility => {
                objectAttributes = {
                    objectId: facility.objectId.substring(3, facility.objectId.length),
                    reason: facility.reason,
                    occurredOn: facility.occurredOn,
                    updatedOn: facility.updatedOn,
                    resolvedOn: facility.resolvedOn,
                    duration: facility.duration
                }

                tempObjs.push(new BrokenObject(objectAttributes));
            })

            brokenObjects = tempObjs;
        })
        .catch(e => {
            console.log(e);
        })
}

refreshDisruptions();
setInterval(() => {
    refreshDisruptions();
}, 300000);

function getJSONFromURL(url) {
    return new Promise((resolve, reject) => {
        curl.getJSON(url, {}, function (err, response, data) {
            if (err == null) {
                resolve(data);
            }
            else {
                reject(err);
            }
        });

    })
}


function evaToObject(eva) {
    return new Promise((resolve, reject) => {
        var results = [];
        fs.createReadStream('D_Bahnhof_2017_09_cleaned.csv')
            .pipe(csv({
                separator: ';'
            }))
            .on('data', (data) => results.push(data))
            .on('end', () => {
                results.forEach(res => {
                    if (res.EVA_NR == eva) {
                        resolve(res.IFOPT)
                    }
                });
                reject('undefined')
            });
    })
}