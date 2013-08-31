var dates = require('./dates');
    // epro = require('./epro'),
    // cleanup = require('./cleanup'),
    // db = require('./db');
//
// 1. get an array of all dates from 2011/1/1 till now
// 2. for each array item, query the api for all incidents that day, wait 15s to loop
// 3. on response, extract out the xml cdata (xpath) and de-encapulate to valid xml
// 4. DONE: convert xml to json
// 5. DONE: strip json by dumping json.Incidents.Incident to array
// 6. DONE: for each item in array, incert document to mongodb

var firstDate = new Date(2013, 7, 20);

var dateArray = dates.allDays(firstDate);
console.log(dateArray);

var i = 0;
  console.log('got all dates');
  // for (var i = 0; i < dateArray.length; i++) {
  do {
    console.log('date: ' + dateArray[i]);
    // epro.incidentsForDate(result[i], function(err, result) {
      // console.log('got epo results for ' + result[i]);
      // cleanup.soap2json(result, function(err, result) {
        // console.log('cleaned up data for ' + result[i]);
        // db.insertAll(result, function(err, result) {
          // console.log(result);
        // });
      // });
    // });
    i++;
  } while(i < dateArray.length);
