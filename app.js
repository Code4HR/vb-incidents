var parser = require('xml2json');
var fs = require('fs');
var MongoClient = require('mongodb').MongoClient;
// var beautify = require('js-beautify').js_beautify;
// var jsonpath = require('JSONPath').eval;

MongoClient.connect('mongodb://localhost:27017/vbpd', function(err, db) { 
  if (err) throw err;
  console.log('connected to db');
  fs.readFile('incident-7-2-2013.xml', function(err, xml) {
    if (err) throw err;

    var json = JSON.parse(parser.toJson(xml, {sanitize: false}));
    //console.log(JSON.stringify(json, null, 0));
    //json = beautify(json, {indent_size: 2});
    console.log('parsed json for ' + json.length + ' documents');
    //for (var i = 0; i < json.length; i++) {
      // for each object in the json array, insert into db
    //  console.log('on document ' + i);
    //  db.collection('incidents').insert(json[i], function (err, inserted) {
    //    if (err) throw err;
    //    console.dir('inserted a doc with ' + JSON.stringify(inserted.CaseNo));
    //  });
    //}

    //console.log(json.Incidents.Incident);
    fs.writeFile('output.json', JSON.stringify(json.Incidents.Incident, null, 0));
    return db.close();
  });
});

