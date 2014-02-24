/*jslint node:true*/
var MongoClient = require('mongodb').MongoClient;

module.exports = function (req, res, next) {
    MongoClient.connect('mongodb://127.0.0.1/incidentreports', function (err, db) {
        if (err) {
            res.send(500);
            return;
        }

        var collection = db.collection('incidents');
        collection.distinct("Location.City", function (lookupErr, lookupData) {
            res.send(lookupData.sort());
            db.close();
            return;
        });
    });
};