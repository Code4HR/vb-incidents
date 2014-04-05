var MongoClient = require('mongodb').MongoClient;

function numberWithCommas(x) {
	"use strict";
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

exports.index = function (req, res) {
    "use strict";
	res.render('index', { title: 'Virginia Beach Crime Data' });
};

exports.trends = function (req, res) {
    "use strict";
	res.render('trends', { title: 'Virginia Beach Crime Data Trends' });
};

exports.about = function (req, res) {
    "use strict";
	res.render('about', { title: 'About Virginia Beach Crime Data' });
};

exports.incidents = function (db) {
    "use strict";
    var moment = require('moment'),
		totalIncidents;

	// do a find and get the cursor count
	db.collection('incidents').find().count(function (err, count) {
		totalIncidents = numberWithCommas(count);
		db.close();
	});

    return function (req, res) {
		db.collection('incidents').find({}, { sort : [['ReportDate', 'desc']] }).limit(50).toArray(function (err, result) {
            res.render('incidents', { "incidents" : result, moment: moment, totalIncidents : totalIncidents });
		});
    };
};

exports.getCityList = function (db) {
    "use strict";
    return function (req, res) {
		db.collection('incidents').distinct("Location.City", function (e, result) {
			res.send(result.sort());
		});
    };
};

exports.getZipCodes = function (db) {
    "use strict";
    return function (req, res) {
		db.collection('incidents').distinct("Location.Zip", function (e, result) {
			res.send(result.sort());
		});
    };
};

exports.getNeighborhoods = function (db) {
    "use strict";
    return function (req, res) {
		db.collection('incidents').distinct("Location.Neighborhood", function (e, result) {
			res.send(result.sort());
		});
    };
};

exports.getCrimes = function (db) {
    "use strict";
    return function (req, res) {
		db.collection('incidents').distinct("Crimes.Crime.CrimeDescription", function (e, result) {
			res.send(result.sort());
		});
    };
};

exports.zipCodeGroup = function (req, res) {
	"use strict";
    MongoClient.connect('mongodb://127.0.0.1/incidentreports', function (err, db) {
        if (err) {
            res.send(500);
            return;
        }

		var collection = db.collection('incidents');
		collection.aggregate([
			{
				$group: {
					_id: "$Location.Zip",
					count: { $sum: 1 }
				}
			},
			{ $sort: {_id: 1} },
			{ $match: { count: { $gt: 1 } } }
		],  function (lookupErr, lookupData) {
            //res.send(lookupData.sort());
			res.render('zipCodeGroup', { "incidents" : lookupData });
            db.close();
            return;
        });
    });
};