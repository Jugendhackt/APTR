const express = require("express");
const cors = require('cors');
const bodyParser = require("body-parser");
const port = 1337;

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