'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    //uri: process.env.MONGOLAB_URI
    uti: 'mongodb://localhost/whichmethod-dev'
  },

  seedDB: true
};
