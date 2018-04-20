"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const restService = express();
global.config = {"salutation": "", "sessionid":"", "success":"hello","flag":"0"};
restService.use(
  bodyParser.urlencoded({
    extended: true
  })
);

restService.use(bodyParser.json());

restService.post("/echo", function(req, res) {
  var speech =
    req.body.result &&
    req.body.result.parameters &&
    req.body.result.parameters.echoText
      ? req.body.result.parameters.echoText
      : "Seems like some problem. Speak again.";
	  config.salutation=req.body.result.parameters.echoText;
	  config.sessionid=req.body.sessionId;
	  if(req.body.result.parameters.echoText){
		getExtraData(function(err, data){ 
        		if(err) return res.send(err);       
        		res.send(data);
		});
  	   return res.json({
	    speech: "ok vinay",
	    displayText:"Naman",
	    source: "webhook-echo-sample"
  	  });
	  } else{
		return res.json({
		    speech: "",
		    displayText:"Naman",
		    source: "webhook-echo-sample"
  		});
	}
});

restService.get('/', function(req, res) {
	res.jsonp({"message":config.salutation, "id":config.sessionid,"done":config.success});
		
});

function getExtraData(callback){
    request('http://localhost/php-rest/api.php/routes?filter=route_short_name', function(error, response, body) {
        if (!error && response.statusCode == 200) {
            result = JSON.stringify(JSON.parse(body));          
            return callback(result, false);
        } else {            
            return callback(null, vinay failed!);;
        }
    });
}

function completed(){
	config.success="done";
	config.salutation="";
}

restService.get('/echo', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

restService.listen(process.env.PORT || 8000, function() {
  console.log("Server up and listening");
});
