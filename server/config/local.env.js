'use strict';

// Use local.env.js for environment variables that grunt will set when the server starts locally.
// Use for your api keys, secrets, etc. This file should not be tracked by git.
//
// You will need to set these on the server you deploy to.

module.exports = {
  DOMAIN: 'http://localhost:9000',
  SESSION_SECRET: 'whichmethod-secret',
  // MONGOLAB_URI : 'mongodb://contraception:whichmethod@ds045057.mongolab.com:45057/contraception',

  MONGOLAB_URI : 'mongodb://contraception:whichmethod@ds035683.mongolab.com:35683/whichmethod',
  // MONGOLAB_URI : "mongodb://whichmethod:HelpMeChoose123!@ds051933.mongolab.com:51933/whichmethod",

  
  // Control debug level for modules using visionmedia/debug
  DEBUG: ''
};
