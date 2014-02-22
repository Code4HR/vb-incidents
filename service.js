/*jslint node: true*/
var MongoClient = require('mongodb').MongoClient,
    moment = require('moment'),
    vbdata = require('./virginiaBeach');

MongoClient.connect('mongodb://127.0.0.1/test', function (err, db) {
    "use strict";
    if (err) {
        throw err;
    }
    console.log("Connected to database");

    
    var collection = db.collection('incidents');
    collection.drop();
    vbdata({
        collection: collection,
        startDate: moment().subtract('months', 3).format("YYYY-MM-DD"),
        endDate: moment().subtract('days', 1).format('YYYY-MM-DD')
    }).done(function () {
        console.log("All done!");
        db.close();
    });
});