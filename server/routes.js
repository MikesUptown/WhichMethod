/**
 * Main application routes
 */

'use strict';
var userController = require('./api/user/user.controller');
var express = require('express');
var router = express.Router();
var errors = require('./components/errors');

module.exports = function(app) {

  function requireHTTPS(req, res, next) {
    if(req.headers['x-forwarded-proto']!='https' && !req.get('host').match('localhost'))
      res.redirect('https://' + req.get('host') + req.url);
    else
      next(); /* Continue to other routes if we're not redirecting */
  }

  app.use(requireHTTPS);

  // Insert routes below
  // router.get('/api/recommendation', userController.showRecommendation);

  app.route('/recommendation/:id').get(userController.showRecommendation);

  app.use('/api/things', require('./api/thing'));
  app.use('/api/users', require('./api/user'));

  app.use('/auth', require('./auth'));
  
  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendfile(app.get('appPath') + '/main.html');
    });
};
