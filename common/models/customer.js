// Copyright IBM Corp. 2014,2015. All Rights Reserved.
// Node module: loopback-example-user-management
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
var qs = require('querystring');
var config = require('../../server/config.json');
var path = require('path');
var stripe = require('../services/stripe.service');
var request = require('request');
var TOKEN_URI = 'https://connect.stripe.com/oauth/token';
var AUTHORIZE_URI = 'https://connect.stripe.com/oauth/authorize';
var STRIPE_CLIENT_ID = 'doasndoani09jd0aj09j';
var STRIPE_CLIENT_SECRET =  'STRIPE_CLIENT_SECRET';


var emailHost = process.env.NODE_ENV === 'production'? 'api.venturenative.com': 'qa.api.venturenative.com';

module.exports = function(User) {
  //send verification email after registration
  User.afterRemote('create', function(context, user, next) {
    console.log('> user.afterRemote triggered');

    var options = {
      type: 'email',
      to: user.email,
      host: emailHost,
      from: 'Venture Native Support <info@venturenative.com>',
      from_email: 'info@venturenative.com',
      from_name: 'venture native',
      subject: 'Thanks for registering.',
      template: path.resolve(__dirname, '../templates/confirmation.ejs'),
      redirect: encodeURIComponent('http://login.venturenative.com'),
      user: user,
      port: 80

    };

    user.verify(options, function(err, response) {
      if (err) return next(err);

      console.log('> verification email sent:', response);
      var app = require('../../server/server');
      var container = app.models.Container;
      container.createContainer({
        name: 'customer' + "-" + user.id
      }, next);
    });

  });

  //send password reset link when requested
  User.on('resetPasswordRequest', function(info) {
    var url = 'http://' + config.host + ':' + config.port + '/reset-password';
    var html = 'Click <a href="' + url + '?access_token=' +
        info.accessToken.id + '">here</a> to reset your password';

    User.app.models.Email.send({
      to: info.email,
      from: info.email,
      subject: 'Password reset',
      html: html
    }, function(err) {
      if (err) return console.log('> error sending password reset email');
      console.log('> sending password reset email to:', info.email);
    });
  });



  User.stripecallback = function(req, res, cb) {

    var query =  req.query;
    console.log(query);

    var userid = query.state;
    var access_code = query.code;

    request.post({
      url: TOKEN_URI,
      form: {
        grant_type: 'authorization_code',
        client_id: STRIPE_CLIENT_ID,
        code: access_code,
        client_secret: STRIPE_CLIENT_SECRET
      }
    }, function(err, r, body) {
      if(err) return res.send(err);
      var userStripeId = JSON.parse(body).stripe_user_id;

      // attach it to user object and save
      User.findById(userid, {
        stripeId: userStripeId
      }, function(error, savedUser) {
        if(error) {
          res.send(error);
        }
        if(savedUser.stripeId = userStripeId) {
          res.redirect('app.venturenative.com');
        } else {
          res.redirect('app.venturenative.com');
        }
        cb();
      });
    });
  };

  User.remoteMethod('stripecallback',
    {
      http: {path: '/stripecallback', verb: 'get'},
      accepts: [
        {arg: 'req', type: 'object', 'http': {source: 'req'}},
        {arg: 'res', type: 'object', 'http': {source: 'res'}}]
    }
  );


  User.stripe = function(id, res, cb) {
    // Redirect to Stripe /oauth/authorize endpoint
    res.redirect(AUTHORIZE_URI + '?' + qs.stringify({
      response_type: 'code',
      scope: 'read_write',
      state: id,
      client_id: STRIPE_CLIENT_ID
    }));
  }


  User.remoteMethod('stripe',
    {
      http: {path: '/:id/stripe', verb: 'get'},
      accepts: [
        {arg: 'id', type: 'string'},
        {arg: 'res', type: 'object', 'http': {source: 'res'}}
      ]
    }
  );

};
