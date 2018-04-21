"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const restService = express();
var request = require('request');
global.config = {"salutation": "", "sessionid":"", "success":"hello","flag":"0"};
restService.use(
  bodyParser.urlencoded({
    extended: true
  })
);

restService.use(bodyParser.json());

restService.post("/echo", function(req, res) {
  console.log("Request",req.body);
  var speech =
    req.body.result &&
    req.body.result.parameters &&
    req.body.result.parameters.echoText
      ? req.body.result.parameters.echoText
      : "Seems like some problem. Speak again.";
	  config.salutation=req.body.result.parameters.echoText;
	  config.sessionid=req.body.sessionId;
if(req.body.metadata.intentName = "FLP_Data") {
    res.json({
	    speech: "OK FLP_Data Received",
	    displayText:"OK FLP_Data Received",
	    source: "webhook-echo-sample"
     });	
} else if(req.body.result.parameters.echoText){
     res.json({
	    speech: "ok vinay",
	    displayText:"Naman",
	    source: "webhook-echo-sample"
     });setTimeout(function(){
		getExtraData(req.body)},2000)
}else {
	 res.json({
	    speech: "",
	    displayText:"Naman",
	    source: "webhook-echo-sample"
	});
}
});

restService.get('/', function(req, res) {
	res.jsonp({"message":config.salutation, "id":config.sessionid,"done":config.success});
		
});

function getExtraData(ecoreq){
	var body = {"lang": "en","event": {name: "RESULTS_READY"},"sessionId": ecoreq.sessionId,"contexts":ecoreq.result.contexts};
	console.log("Query Body",JSON.stringify(body));
	process.nextTick(function(){
        	var options = { method: 'POST',
			  url: 'https://api.dialogflow.com/v1/query?v=20150910',
			  headers: 
			   { authorization: 'Bearer a482a2229fb34fbeba90f6abfb3b7d01',
			     'content-type': 'application/json' },
			  body: JSON.stringify(body)};

			request(options, function (error, response, body) {
			  if (error) throw new Error(error);

			  console.log(body);
			});

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
