var express = require('express');
var routes = require('./routes');
var lib = require('./lib/lib');
var http = require('http');
var path = require('path');
var stylus = require('stylus');
var nib = require('nib');
var moment = require('moment');
// db setup
var mongo = require('mongodb');
var mongo = require('mongoskin');
var db = mongo.db("mongodb://localhost:27017/incidentreports", {native_parser: true});

var app = express();

// setup stylus to compile CSS files with help of nib
function compile(str, path) {
	"use strict";
	return stylus(str)
		.set('filename', path)
		.use(nib());
}

// all environments
app.set('port', process.env.PORT || 1337);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' === app.get('env')) {
    app.use(express.errorHandler());
}

// get total # of incidents, first and last incident and save to app variables
db.collection('incidents').find().count(function (err, count) {
	"use strict";
	app.locals.totalIncidents = lib.numberWithCommas(count);
});
db.collection('incidents').find({}, { sort: [['ReportDate', 'desc']] }).limit(1).toArray(function (err, result) {
	"use strict";
	if (result !== null) {
		app.locals.firstIncidentDate = moment(result[0].ReportDate).format("MM/DD/YYYY h:mm a");
	}
});
db.collection('incidents').find({}, { sort: 'ReportDate' }).limit(1).toArray(function (err, result) {
	"use strict";
	if (result !== null) {
		app.locals.lastIncidentDate = moment(result[0].ReportDate).format("MM/DD/YYYY h:mm a");
	}
});

// GET 
app.get("/", routes.index);
app.get("/trends", routes.trends);
app.get("/about", routes.about);
app.get("/neighborhood", routes.neighborhood(db));
app.get("/incidents", routes.incidents(db));
app.get("/cities", routes.getCityList(db));
app.get("/zipcodes", routes.getZipCodes(db));
app.get("/neighborhoods", routes.getNeighborhoods(db));
app.get("/crimes", routes.getCrimes(db));
app.get("/incidents_by_zip_code", routes.zipCodeGroup);
app.get("/search_neighborhood", routes.search_neighborhood);

http.createServer(app).listen(app.get('port'), function () {
    "use strict";
    console.log('Express server listening on port ' + app.get('port'));
});
