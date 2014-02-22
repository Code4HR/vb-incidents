/*jslint node: true*/
/*jslint nomen: true*/

var moment = require('moment'),
    q = require('q'),
    soap = require('soap'),
    url = 'https://public.vbgov.com/Secure/service.asmx?wsdl',
    parseString = require('xml2js').parseString,
    _ = require('lodash');

function convertArrayToValue(obj) {
    "use strict";
    if (_.isString(obj)) {
        obj = obj.trim();
    } else {
        _.each(obj, function (prop, propName) {
            if (_.isArray(prop)) {
                if (prop.length <= 1) {
                    obj[propName] = prop[0];
                    if (_.isString(obj[propName])) {
                        obj[propName] = obj[propName].trim();
                    }
                }
            }
            convertArrayToValue(obj[propName]);
        });
    }
}

function processDate(dateToProcess, collection) {
    "use strict";
    var defer = q.defer();

    console.log("start " + dateToProcess);

    soap.createClient(url, function (err, client) {
        client.addSoapHeader("<UserCredentials xmlns=\"http://public.vbgov.com/secure\"><Email>bret@codeforamerica.org</Email><UserName>bret@codeforamerica.org</UserName><Password>krXeARx8C#3ZnMc</Password></UserCredentials>");
        client.GetIncidentData({
            forDate: dateToProcess
        }, function (err, result) {
            if (err) {
                console.log("error - timeout?");
                defer.reject(err);
                return;
            }
            parseString(result.GetIncidentDataResult, function (err2, result2) {
                var realIncidents = result2.Incidents.Incident;
                _.each(realIncidents, function (val) {
                    convertArrayToValue(val);
                });
                collection.insert(realIncidents, function (err, docs) {
                    console.log("end " + dateToProcess);
                    defer.resolve();
                });
            });
        });
    });
    return defer.promise;
}

module.exports = function (options) {
    "use strict";
    var currentSearchDate,
        momentEndDate,
        allRequests = [],
        defer = q.defer();

    if (options.collection === undefined) {
        console.log("collection not found.");
        return;
    }
    if (options.startDate === undefined) {
        options.startDate = moment().subtract('month', 1).format("YYYY-MM-DD");
        console.log("No start date provided.  Defaulting to " + options.startDate);
    }
    if (options.endDate === undefined) {
        options.endDate = moment().subtract('days', 1).format("YYYY-MM-DD");
        console.log("No end date provided.  Defaulting to " + options.endDate);
    }

    currentSearchDate = moment(options.startDate);
    momentEndDate = moment(options.endDate);

    while (currentSearchDate.isBefore(momentEndDate) || currentSearchDate.isSame(momentEndDate)) {
        console.log("Adding " + currentSearchDate.format("YYYY-MM-DD") + " to the request pool");
        allRequests.push(processDate(currentSearchDate.format("YYYY-MM-DD"), options.collection));
        currentSearchDate = currentSearchDate.add('days', 1);
    }

    q.allSettled(allRequests).done(function () {
        defer.resolve();
    });

    return defer.promise;
};