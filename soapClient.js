var soap = require('soap');
  var url = 'https://public.vbgov.com/Secure/service.asmx';
  var args = {GetIncidentData: {forDate: "2013-07-02"}};
  soap.createClient(url, function(err, client) {
      client.addSoapHeader({UserCredentials: [{Email: "bret@codeforamerica.org"}, {UserName: "bret@codeforamerica.org"}, {Password: "krXeARx8C#3ZnMc"}]});
      client.MyFunction(args, function(err, result) {
          console.log(result);
      });
  });