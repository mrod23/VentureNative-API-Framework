'use strict';

module.exports = {
	"db": {
		"name": "db",
		"connector": "memory"
	},
	"vn-Database": {
		"host": "ec2-54-162-49-39.compute-1.amazonaws.com",
		"port": 27017,
		"database": "ENTER YOUR OWN",
		"password": "ENTER YOUR OWN",
    	"name": "ENTER YOUR OWN",
		"user": "ENTER YOUR OWN",
		"connector": "mongodb"
	},
	"files-prod": {
		"name": "files-prod",
		"provider": "amazon",
    	"acl": "public-read",
		"connector": "loopback-component-storage",
	    "keyId": "ENTER YOUR OWN",
	    "key": "ENTER YOUR OWN"
	},
	"mandrill-email-prod": {
		"name": "mandrill-email-prod",
		"connector": "mail",
		"transports": [{
			"type": "smtp",
			"host": "smtp.mandrillapp.com",
			"secure": false,
			"port": 587,
			"tls": {
				"rejectUnauthorized": false
			},
			"auth": {
				"user": "ENTER YOUR OWN",
				"pass": "ENTER YOUR OWN"
			}
		}]
	}
}

