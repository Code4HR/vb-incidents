// run this file with node. entry point for app
var dates =    require('./lib/dates'),
     epro =    require('./lib/epro'),
     cleanup = require('./lib/cleanup'),
     db =      require('./lib/db');

// NOTE (2/20/2014) Much of this still isn't working. 
// Bret: I'm in the process of merging seperate scripts into one node app


// 1. get an array of all dates from now till date listed below
// 2. for each array date, query the api for all incidents that day, wait 15s to loop to be a good netcitizen
// 3. on response, extract out the xml cdata (xpath) and de-encapulate to valid xml
// 4. DONE: convert xml to json
// 5. DONE: strip json by dumping json.Incidents.Incident to array
// 6. DONE: for each item in array, incert document to mongodb

// this is how far we want to go back from today
var firstDate = new Date(2013,2,2);
console.log("create firstDay " + firstDate.toDateString());

//var dateArray = dates.allDays(firstDate);
//console.log(dateArray);
//
//var i = 0;
//  console.log('got all dates');
//  // for (var i = 0; i < dateArray.length; i++) {
//  do {
//    console.log('date: ' + dateArray[i]);
//     epro.incidentsForDate(dateArray[i], function(err, result) {
//       console.log('got epo results for ' + result);
//       cleanup.soap2json(result, function(err, result) {
//         console.log('cleaned up data for ' + result);
//         db.insertAll(result, function(err, result) {
//           console.log(result);
//         });
//       });
//     });
//    i++;
//  } while(i < dateArray.length);
