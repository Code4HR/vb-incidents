var MongoClient = require('mongodb').MongoClient;
var db = undefined;

MongoClient.connect('mongodb://localhost:27017/vbpd', function(err, db) { 
  if (err) throw err;
  console.log('connected to db');
  db = db;
});

exports.insert = function (incidents) {
  // var json = JSON.parse(parser.toJson(xml, {sanitize: false}));
  // var incidents = json.Incidents.Incident;
  
  // console.log('parsed json for ' + incidents.length + ' documents');
  
  for (var i = 0; i < incidents.length; i++) {
    // for each object in the json array, insert into db
    // console.log('on document ' + i);
    
    db.collection('incidents').insert(incidents[i], function (err, inserted) {
      if (err) throw err;
      console.dir('inserted a doc with ' + JSON.stringify(inserted.CaseNo));
    });
  }

  //fs.writeFile('output.json', JSON.stringify(json.Incidents.Incident, null, 0));
  // return db.close();
};

