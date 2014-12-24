/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Thing = require('../api/thing/thing.model');
var User = require('../api/user/user.model');



// User.find({}).remove(function() {
//   User.create({
//     provider: 'local',
//     name: 'Test User',
//     email: '999',
//     password: '999'
//   }, {
//     provider: 'local',
//     role: 'admin',
//     name: 'Admin',
//     email: 'admin',
//     password: 'admin'
//   }, function() {
//       console.log('finished populating users');
//     }
//   );
// });

User.create( {
    provider: 'local',
    role: 'admin',
    name: 'Admin',
    email: 'admin',
    password: 'admin',
    zip:999
  }, function() {
      console.log('finished populating users');
    })
  