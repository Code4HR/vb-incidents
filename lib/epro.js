var https = require('https');

exports.incidentsForDate = function (myDate) {
    // format our incoming date
  	console.log(myDate);
    // API is expecting a date, formatted as YYYY-MM-DD
    // Javascript won't add leading zeros by default, so we have to do it the hard way
    var day = myDate.getFullYear() 
    		 + "-" + ('0' + myDate.getMonth().toString()).slice(-2)
             + "-" + ('0' + myDate.getDay().toString()).slice(-2);
//  day = day.getFullYear().toString() + "-" + day.getMonth().toString() + "-" + day.getDay().toString(); 
  console.log(day); 
//    day = "2014-02-02";
    // we manually create the body envelope of our SOAP request, using an account requested with vbgov
  var body = '<?xml version="1.0" encoding="utf-8"?><soap12:Envelope xmlns:xsi=' + 
             '"http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" ' +
             'xmlns:soap12="http://www.w3.org/2003/05/soap-envelope"><soap12:Header>' +
             '<UserCredentials xmlns="http://public.vbgov.com/secure"><Email>' +
             'bret@codeforamerica.org</Email><UserName>bret@codeforamerica.org' +
             '</UserName><Password>krXeARx8C#3ZnMc</Password></UserCredentials>' +
             '</soap12:Header><soap12:Body><GetIncidentData xmlns="http://public.vbgov.com/secure">' +
             '<forDate>' + day + '</forDate></GetIncidentData></soap12:Body></soap12:Envelope>';
  
  //set http options
  var options = {
      hostname: "public.vbgov.com",
      path: "/Secure/service.asmx",
      port: 443,
      method: "POST",
      headers: {
          'Cookie': "cookie",
          'Content-Type': 'text/xml',
          'Content-Length': Buffer.byteLength(body)
      }
  };
  
  // make the http POST request
  var req = https.request(options, function(res) {
    console.log('STATUS: ' + res.statusCode);
    // console.log('HEADERS: ' + JSON.stringify(res.headers));
    res.setEncoding('utf8');
    var string = '';

    // as long as we're getting data, add it to our string
    res.on('data', function (chunk) {
      //console.log('BODY: ' + chunk);
      // take this chunk and move to next step
      string += chunk;
    });

    // when data is done flowing, return from this function with result
    res.on('end', function () {
      //fs.writeFile('body2.xml', data);
        console.log("returning string from API for " + day);
      return string;
    });

    // if we get a http error, let someone know, call your mom or confess your sins.js
    req.on('error', function(err) {
      console.log('problem with request: ' + err.message);
    });

  });

  req.write( body );
  // close connection
  req.end();
};
