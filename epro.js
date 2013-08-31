var https = require('https');

exports.incidentsForDate = function (date) {
  // send request
  var day = Date.parse(date);
  day = day.getFullYear().toString() + "-" + day.getMonth().toString() + "-" + day.getDay().toString(); 
  var body = '<?xml version="1.0" encoding="utf-8"?><soap12:Envelope xmlns:xsi=' + 
             '"http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" ' +
             'xmlns:soap12="http://www.w3.org/2003/05/soap-envelope"><soap12:Header>' +
             '<UserCredentials xmlns="http://public.vbgov.com/secure"><Email>' +
             'bret@codeforamerica.org</Email><UserName>bret@codeforamerica.org' +
             '</UserName><Password>krXeARx8C#3ZnMc</Password></UserCredentials>' +
             '</soap12:Header><soap12:Body><GetIncidentData xmlns="http://public.vbgov.com/secure">' +
             '<forDate>' + day + '</forDate></GetIncidentData></soap12:Body></soap12:Envelope>';
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
  var req = https.request(options, function(res) {
    console.log('STATUS: ' + res.statusCode);
    // console.log('HEADERS: ' + JSON.stringify(res.headers));
    res.setEncoding('utf8');
    var string = '';

    res.on('data', function (chunk) {
      //console.log('BODY: ' + chunk);
      // take this chunk and move to next step
      string += chunk;
    });

    res.on('end', function () {
      //fs.writeFile('body2.xml', data);
      return string;
    });

    req.on('error', function(err) {
      console.log('problem with request: ' + err.message);
    });

  });

  req.write( body );
  // close connection
  req.end();
};
