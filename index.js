const express = require("express");
const cors = require('cors');
const bodyParser = require("body-parser");
const curl = require("curl");
const BrokenObject = require("./BrokenObject.js");
const port = 1337;


/*** API ***/
var app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(port, function () {
    console.log('API listening on Port ' + port);
})

app.get('/', function (req, res) {
    res.send("API-Schnittstelle");
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
        curl.getJSON(url, {}, function(err, response, data){
            if(err == null) {
                resolve(data);
            }
            else {
                reject(err);
            }
        });

    })
}