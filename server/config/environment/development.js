'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    //uri: process.env.MONGOLAB_URI
    uri: 'mongodb://localhost/whichmethod-dev'
  },

  seedDB: true
};
