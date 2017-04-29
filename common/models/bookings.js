'use strict';

var emailService = require('../services/email.service');
var loopback = require('loopback');
module.exports = function(Booking) {

  Booking.afterCreate = function (next) {

    console.log(this);
    var emailOptions = {
    "host": "app.venturenative.com",
    "to": [{
          "email": this.user.email,
          "name": this.user.name,
          "type": "to"
      }],
     "viewValues": {
        USER_NAME: this.user.name,
        VENTURE_NAME: this.venture.name,
        USER_PROFILE_LINK: 'app.venturenative.com/user/' + this.user.id,
        USER_LOCATION: 'Test location',
        BOOKING_DATE: this.requestedDate,
        BOOKING_TIME: this.requestedTime,
        BOOKING_ACCEPT_LINK: 'api.venturenative.com/booking/' + this.id + '/confirm/',
        BOOKING_CHANGE_DATE_LINK: 'http://app.venturenative.com/booking/change' + this.id + '/change/',
        //USER_PROFILE_IMAGE: this.user.images[0]
        }
    };

      emailService.bookingRequest(emailOptions, next);
  };

  Booking.acceptVenture = function(id, token, cb) {

    Booking.findOne({
        where: {id: id},
        include: [{venture: 'host'}, 'user']
      }, function(err, booking) {

      if (err) {
        console.log(err);
        cb(err);
      }
      else {
        booking = booking.toJSON();
        console.log("running");
        booking.status = "confirmed";
        console.log(booking);
        console.log(booking);
        console.log(booking['venturer']);

        var emailOptions = {
        "host": "app.venturenative.com",
        "to": [{
              "email": booking.user.email,
              "name": "mike",
              "type": "to"
          }],
         "viewValues": {
            USER_NAME: "test", //booking.user.name,
            VENTURE_NAME: "test", //booking.venture.name,
            // USER_PROFILE_LINK: 'app.venturenative.com/user/' + booking.user.id,
            USER_LOCATION: 'Test location',
            BOOKING_DATE: booking.requestedDate,
            BOOKING_TIME: booking.requestedTime
            //USER_PROFILE_IMAGE: booking.user.images[0]
            }
        };

        emailService.confirmationVentureEmail(emailOptions, cb);
        //cb(null, booking);
      }
    });


  };

  Booking.remoteMethod('acceptVenture',
    {
      http: {path: '/:id/accept/:token', verb: 'get'},
      accepts: [{arg: 'id', type: 'string'}, {arg: 'token', type: 'string'}],
      returns: [{arg: 'id', type: 'string'}, {arg: 'token', type: 'string'}]
    }
  );

  Booking.beforeRemote('*.*', function updateLastChanged(ctx, instance, next) {
    debugger;
    if(ctx.instance) {
      var userId = ctx && ctx.req && ctx.req.accessToken.userId
      ctx.instance.updateAttributes({
        lastUpdatedBy: userId,
        lastUpdate: Date.now()
      });
    }

    next();
  });

};
