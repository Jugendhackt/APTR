const express = require("express");
const cors = require('cors');
const bodyParser = require("body-parser");
const curl = require("curl");
const csv = require('csv-parser')
const fs = require('fs')
const BrokenObject = require("./BrokenObject.js");
const StaDa = require("./api/DB-StaDa.js");
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
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify(brokenObjects));
    res.status(200).end();
});


app.get('/getAllDisruptionsWithAss', function (req, res) {
    res.set('Content-Type', 'application/json');
    var ret = []
    brokenObjects.forEach(obj => {
        if(obj.ass != undefined) {
            ret.push(obj);
        }
    })
    res.send(JSON.stringify(ret));
    res.status(200).end();
});

app.get('/objectIsDisrupted/:objectId', function (req, res) {
    console.log(req.params.objectId);
    brokenObjects.forEach(obj => {
        if (obj.objectId == req.params.objectId) {
            res.send(JSON.stringify(obj))
        }
    })
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify({}))
    res.status(200).end();
})

app.get('/getDisruptionCount', function (req, res) {
    res.set('Content-Type', 'application/json');
    res.send(brokenObjects.length + "");
    res.status(200).end();
});

/*** CRAWLER ***/
var brokenObjects = [];
var tempObjs = [];

function refreshDisruptions() {
    getJSONFromURL("https://elescore.de/api/disruptions")
    .then(async function(data) {
        tempObjs = [];

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

        await addNumbers();
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


function evaToIfopt(eva) {
    return new Promise((resolve, reject) => {
        var results = [];
        fs.createReadStream('./evaToIfopt.csv')
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


function ifoptToAss(ifopt) {
    return new Promise((resolve, reject) => {
        var results = [];
        fs.createReadStream('./ifoptToAss.csv')
            .pipe(csv({
                separator: ';'
            }))
            .on('data', (data) => results.push(data))
            .on('end', () => {
                results.forEach(res => {
                    if (res.IFOPT == ifopt) {
                        resolve(res.ASS_NR)
                    }
                });
                reject('undefined')
            });
    })
}

async function addNumbers() {
    tempObjs.forEach((tempFac, i) => {
        StaDa.getStationInfo(tempObjs[i].objectId, i).then((number) => {
            tempObjs[i].evaId = number
            evaToIfopt(number).then(ifopt => {
                tempObjs[i].ifopt = ifopt
                ifoptToAss(ifopt).then(ass => {
                    tempObjs[i].ass = parseInt(ass)
                })
                .catch(e => {console.log(e)})
            })
            .catch(e => {console.log(e)})
        })
        .catch(e => {console.log(e)})
    })
}
