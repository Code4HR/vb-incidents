/*jslint node: true*/
var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var stylus = require('stylus');
var nib = require('nib');

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

// SET
app.set('port', process.env.PORT || 1337);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('env', 'development');

// USE
app.use(express.json());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(stylus.middleware({ src: __dirname + '/public', compile: compile }));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' === app.get('env')) {
	app.use(express.errorHandler());
}

// GET 
app.get("/", routes.index);
app.get("/trends", routes.trends);
app.get("/about", routes.about);
app.get("/incidents", routes.incidents(db));
app.get("/cities", routes.getCityList(db));
app.get("/zipcodes", routes.getZipCodes(db));
app.get("/neighborhoods", routes.getNeighborhoods(db));
app.get("/crimes", routes.getCrimes(db));
app.get("/zipgrouping", routes.zipCodeGroup);

http.createServer(app).listen(app.get('port'), function () {
	"use strict";
	console.log('Express server listening on port ' + app.get('port'));
});
