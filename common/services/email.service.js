'use strict';

var mandrill = require('mandrill-api/mandrill');
var mustache = require('mustache');
var bookingRequestTemplate = require('../templates/bookingRequest');
var ventureAcceptTemplate = require('../templates/ventureAccept-host');


var mandrill_client = new mandrill.Mandrill('WpD3rkkxlLbpDGka_OCx_A');

var newRequestEmail = {
  "html": "<p>This is the sample content in the email</p>",
  "text": "Example text content",
  "subject": "Hello from ",
  "to": [{
          "email": "mrodriguez2323@gmail.com",
          "name": "Mike Rodriguez",
          "type": "to"
      }]
};


var rescheduleEmail = {
  "html": "<p>This is the sample content in the email</p>",
  "text": "Example text content",
  "subject": "Hello from ",
  "to": [{
          "email": "mrodriguez2323@gmail.com",
          "name": "Mike Rodriguez",
          "type": "to"
      }]
};

var baseContent = {
	"from_email": "info@venturenative.com",
 	"from_name": "Venture Native",
 	"headers": {
    	"Reply-To": "info@venturenative.com"
	} 
};

class EmailService {
	
	/**
	* Available Options

	``` 
	{
  	"to": [{
          "email": "mrodriguez2323@gmail.com",
          "name": "Mike Rodriguez",
          "type": "to"
      }],
     "viewValues": {}
	};
	```
	**/

	bookingRequest(options, cb){
		console.log(options);
		var bookingRequest = {
			html: mustache.render(bookingRequestTemplate, options.viewValues),
			to: options.to,
			subject: "Booking request from Venture Native"
		};
		var mandrillOptions = Object.assign({}, bookingRequest, baseContent);	
		this.sendMessage(mandrillOptions, function(err, result){
			cb(err, result);
		});

	}

	sendMessage(message, callback){
		var async = false;
		var ip_pool = "Main Pool";
		mandrill_client.messages.send({"message": message, "async": async, "ip_pool": ip_pool}, function(err, result) {
		  console.log(result);
		  callback(err, result);
		}, function(e) {
		  console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
		  callback(e, null);
		});

	};
	

	/**
	* Available Options
	``` 
	{
  	
  	"text": "Example text content",
  	"subject": "Hello from ",
  	"to": [{
          "email": "mrodriguez2323@gmail.com",
          "name": "Mike Rodriguez",
          "type": "to"
      }]
	};
	```	
	**/
	confirmationVentureEmail(options, cb){
		console.log(options);
		var bookingRequest = {
			html: mustache.render(ventureAcceptTemplate, options.viewValues),
			to: options.to,
			subject: "Booking request from Venture Native"
		};
		var mandrillOptions = Object.assign({}, bookingRequest, baseContent);	
		this.sendMessage(mandrillOptions, function(err, result){
			cb(err, result);
		});

	};
	

	confirmationUserEmail(options){
		var newUserConfirmation = {
			html: mustache.render(bookingRequestTemplate, options.viewValues),
			to: options.to,
			subject: "Welcome to Venture Native!"
		};
		var mandrillOptions = Object.assign({}, newUserConfirmation, baseContent);	
		this.sendMessage(mandrillOptions, function(err, result){
			console.log(err);
			console.log(result);
		});
	};
	
	rescheduleEmail(options){

	};

};


//change this to email service later on 
module.exports = new EmailService(); 
