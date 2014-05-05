/*jslint node:true*/
"use strict";

var MongoClient = require( 'mongodb' ).MongoClient;

exports.index = function ( req, res ) {
	"use strict";
	res.render( 'index' );
};

exports.trends = function ( req, res ) {
	"use strict";
	res.render( 'trends' );
};

exports.about = function ( req, res ) {
	"use strict";
	res.render( 'about' );
};

exports.neighborhood = function ( db ) {
	"use strict";

	var moment = require( 'moment' );

	// get the incidents for the neighborhood
	return function ( req, res ) {
		db.collection( 'incidents' ).find( { 'Location.Neighborhood': req.query.neighborhood }, { sort: [['ReportDate', 'desc']] }).limit( 5 ).toArray( function ( err, result ) {
			if (err) {
				res.send(err);
				return;
			}
			res.render( 'neighborhood', { neighborhood: req.query.neighborhood, "incidents": result, moment: moment });
		});
	}
};

exports.search_neighborhood = function ( req, res ) {
	"use strict";

	MongoClient.connect( 'mongodb://127.0.0.1/incidentreports', function ( err, db ) {
		if ( err ) {
			res.send( JSON.stringify( err ), { 'Content-Type': 'application/json' }, 404 );
			return;
		}

		// get the search term
		var regex = new RegExp( req.query["term"], 'i' );

		var collection = db.collection( 'incidents' );
		collection.find( { 'Location.Neighborhood': regex }, { sort: [['Location.Neighborhood', 'desc']] }).limit( 20 ).toArray( function ( err, result ) {
			if ( err ) {
				res.send( JSON.stringify( err ), { 'Content-Type': 'application/json' }, 404 );
				return;
			}

			res.send( result, { 'Content-Type': 'application/json' }, 200 );
		});
	});
};

exports.incidents = function ( db ) {
	"use strict";
	var moment = require( 'moment' );

	return function ( req, res ) {
		db.collection( 'incidents' ).find( {}, { sort: [['ReportDate', 'desc']] }).limit( 50 ).toArray( function ( err, result ) {
			res.render( 'incidents', {
				"incidents": result,
				moment: moment
			});
		});
	};
};

exports.getCityList = function ( db ) {
	"use strict";
	return function ( req, res ) {
		db.collection( 'incidents' ).distinct( "Location.City", function ( e, result ) {
			res.send( result.sort() );
		});
	};
};

exports.getZipCodes = function ( db ) {
	"use strict";
	return function ( req, res ) {
		db.collection( 'incidents' ).distinct( "Location.Zip", function ( e, result ) {
			res.send( result.sort() );
		});
	};
};

exports.getNeighborhoods = function ( db ) {
	"use strict";
	return function ( req, res ) {
		db.collection( 'incidents' ).distinct( "Location.Neighborhood", function ( e, result ) {
			res.send( result.sort() );
		});
	};
};

exports.getCrimes = function ( db ) {
	"use strict";
	return function ( req, res ) {
		db.collection( 'incidents' ).distinct( "Crimes.Crime.CrimeDescription", function ( e, result ) {
			res.send( result.sort() );
		});
	};
};

exports.zipCodeGroup = function ( req, res ) {
	"use strict";
	MongoClient.connect( 'mongodb://127.0.0.1/incidentreports', function ( err, db ) {
		if ( err ) {
			res.send( 500 );
			return;
		}
		var collection = db.collection( 'incidents' ),
			_ = require( 'lodash' ),
			lib = require('../lib/lib');
		var totalIncidents,
			VBZipCodes = ['23451', '23452', '23453', '23454', '23455', '23456', '23457', '23458', '23459', '23460', '23461', '23462', '23463', '23464', '23465', '23466', '23467', '23471', '23479'],
			zipData = [],
			zipCount = 0,
			chartData;

		// do a find and get the cursor count
		collection.find().count( function ( err, count ) {
			totalIncidents = count;
		});

		// group and count by zip
		collection.aggregate( [
			{
				$group: {
					_id: "$Location.Zip",
					count: { $sum: 1 }
				}
			},
			{ $sort: { _id: 1 } },
			{ $match: { count: { $gt: 1 } } }
		], function ( lookupErr, lookupData ) {
				chartData = "[['Zip Code', 'Incidents']";

				// combine non VB zip codes into Other
				for ( var key in lookupData ) {
					if ( _.contains(VBZipCodes, lookupData[key]._id)) {
						zipData.push( { '_id': lookupData[key]._id, 'count': lib.numberWithCommas( lookupData[key].count ), 'percentofTotal': ( ( lookupData[key].count / totalIncidents ) * 100 ).toFixed( 2 ), 'zipURL': 'https://www.google.com/maps/place/Virginia+Beach,+VA+' + lookupData[key]._id, 'zipURLTarget': '_blank' });
						chartData = chartData + ",['" + lookupData[key]._id + "', " + lookupData[key].count + "]";
					}
					else {
						zipCount = zipCount + lookupData[key].count;
					}
				}
				chartData = chartData + ",['Other', " + zipCount + "]]";
				zipData.push( { '_id': '*Other', 'count': lib.numberWithCommas( zipCount ), 'percentofTotal': ( ( zipCount / totalIncidents ) * 100 ).toFixed( 2 ), 'zipURL': '#', 'zipURLTarget': '_self' });
				zipData.push( { '_id': 'Total Incidents', 'count': req.app.get( 'totalIncidents' ), 'percentofTotal': '100', 'zipURL': '#', 'zipURLTarget': '_self' });

				res.render( 'zipCodeGroup', { "incidents": zipData, "chartData" : chartData});

				db.close();
				return;
			});
	});
};