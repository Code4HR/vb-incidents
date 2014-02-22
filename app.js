/*jslint node: true*/
var express = require('express'),
    app = express(),
    port = process.env.PORT || 1337,
    routes = require('./routes');

app.use(express.logger());

// GET /
app.get("/", routes.index);
app.get("/cities", routes.getCityList);
app.get("/zipCodes", routes.getZipCodes);
app.get("/neighborhoods", routes.getNeighborhoods);

app.listen(port);
console.log("Now listening on port " + port);