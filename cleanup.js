// turn a SOAP xml blob in to just our incident data, in json
// since data is encapulated inside soap xml, we'll have to parse DOM twice
var xml2js = require('xml2js');

var parser = new xml2js.Parser({ignoreAttrs: true});

exports.soap2json = function (xmlString) {
  parser.parseString(xmlString, function (err, json) {
    // strip outer soap JSON
    var innerXml = json['soap:Envelope']['soap:Body'][0].GetIncidentDataResponse[0].GetIncidentDataResult[0];
    // now parse inner XML to JSON
    parser.parseString(innerXml, function (err, innerJson) {
      // only returns a array of incidents
      return innerJson.Incidents.Incident;
    });
  });
};
