/*jslint node: true*/
var MongoClient = require('mongodb').MongoClient,
    moment = require('moment'),
    vbdata = require('./virginiaBeach');

/* connect to Mongo, must have a database named "incidentreports" */
MongoClient.connect('mongodb://127.0.0.1/incidentreports', function (err, db) {
    "use strict";
    if (err) {
        throw err;
    }
    console.log("Connected to database");

    var collection = db.collection('incidents');

	// drop the current incidents collection
	// this needs to be modified to intelligently update existing data rather than
	// nuking the entire collection and starting over
    collection.drop();

    vbdata({
        collection: collection,
        startDate: moment("2013-01-01").format("YYYY-MM-DD"),
        endDate: moment().subtract('days', 1).format('YYYY-MM-DD')
    }).done(function () {
		// had to comment out db.close below in order for this code to run
		// need to figure out how to have this processed with q.js like the vbdata function 
		console.log("Converting report date to a date field.");
		var cursor = collection.find();
		cursor.each(function (err, doc) {
			if (err) {
				throw err;
			}
			if (doc !== null) {
				// convert the ReportDate field to a Date so we can do fun stuff with the dates
				collection.update({_id : doc._id}, {$set : {ReportDate : new Date(doc.ReportDate)}}, function (err, inserted) {
					if (err) {
						throw err;
					}
				});
				console.log("Updating document:  " + doc._id);
			}
		});
        console.log("All done!");
        //db.close();
    });
});