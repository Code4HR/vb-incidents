var parser = require('xml2json');
var fs = require('fs');
var MongoClient = require('mongodb').MongoClient;
//
// 1. get an array of all dates from 2011/1/1 till now
// 2. for each array item, query the api for all incidents that day, wait 15s to loop
// 3. on response, extract out the xml cdata (xpath)
// 4. de-encapulate the cdata
// 5. DONE: convert xml to json
// 6. DONE: strip json by dumping json.Incidents.Incident to array
// 7. DONE: for each item in array, incert document to mongodb
// 8. hope we didn't kill their system by pulling all that data

MongoClient.connect('mongodb://localhost:27017/vbpd', function(err, db) { 
  if (err) throw err;
  console.log('connected to db');
  
  fs.readFile('incident-7-2-2013.xml', function(err, xml) {
    if (err) throw err;

    var json = JSON.parse(parser.toJson(xml, {sanitize: false}));
    var incidents = json.Incidents.Incident;
    
    console.log('parsed json for ' + incidents.length + ' documents');
    
    for (var i = 0; i < incidents.length; i++) {
      // for each object in the json array, insert into db
      console.log('on document ' + i);
      
      db.collection('incidents').insert(incidents[i], function (err, inserted) {
        if (err) throw err;
        console.dir('inserted a doc with ' + JSON.stringify(inserted.CaseNo));
      });
    }

    //fs.writeFile('output.json', JSON.stringify(json.Incidents.Incident, null, 0));
    return db.close();
  });
});

