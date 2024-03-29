'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');

var UserSchema = new Schema({
  name: String,
  timeStamp: Date,
  email: { type: String, lowercase: true },
  role: {
    type: String,
    default: 'user'
  },
  hideFromAdmin: Boolean,
  hashedPassword: String,
  provider: String,
  salt: String,
  currentQuestion: String,
  currentSection: Number,
  zip: Number,
  answers: [{
    question: String,
    answer: Schema.Types.Mixed
  }],
  consent1:Boolean,
  consent2:Boolean,
  recommendation:{
    green:[{longText:String,name:String,img:String,nameES:String}],
    red:[{longText:String,name:String,img:String,nameES:String}],
    yellow:[{longText:String,name:String,img:String,nameES:String}]
  }

});

/**
 * Virtuals
 */
UserSchema
  .virtual('password')
  .set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function() {
    return this._password;
  });

// Public profile information
UserSchema
  .virtual('profile')
  .get(function() {
    return {
      'name': this.name,
      'role': this.role,
      'currentQuestion':this.currentQuestion,
      'answers':this.answers,
    };
  });

// Non-sensitive info we'll be putting in the token
UserSchema
  .virtual('token')
  .get(function() {
    return {
      '_id': this._id,
      'role': this.role
    };
  });

/**
 * Validations
 */

// Validate empty email
UserSchema
  .path('email')
  .validate(function(email) {
    return email.length;
  }, 'Email cannot be blank');

// Validate empty password
UserSchema
  .path('hashedPassword')
  .validate(function(hashedPassword) {
    return hashedPassword.length;
  }, 'Password cannot be blank');

// Validate email is not taken
// UserSchema
//   .path('email')
//   .validate(function(value, respond) {
//     var self = this;
//     this.constructor.findOne({email: value}, function(err, user) {
//       if(err) throw err;
//       if(user) {
//         if(self.id === user.id) return respond(true);
//         return respond(false);
//       }
//       respond(true);
//     });
// }, 'The specified email address is already in use.');

UserSchema
  .path('zip')
  .validate(function(zip) {
    return zip.length;
  }, 'Zipcode cannot be blank');

UserSchema
  .path('zip')
  .validate(function(zip) {
    if((zip+'').length<3){
      return false;
    }
    else return true;
  }, 'Please enter 3 digits of your zipcode');


var validatePresenceOf = function(value) {
  return value && value.length;
};

/**
 * Pre-save hook
 */
UserSchema
  .pre('save', function(next) {
    if (!this.isNew) return next();

    if (!validatePresenceOf(this.hashedPassword))
      next(new Error('Invalid password'));
    else
      next();
  });

/**
 * Methods
 */
UserSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */
  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashedPassword;
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */
  makeSalt: function() {
    return crypto.randomBytes(16).toString('base64');
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */
  encryptPassword: function(password) {
    if (!password || !this.salt) return '';
    var salt = new Buffer(this.salt, 'base64');
    return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
  }
};

module.exports = mongoose.model('User', UserSchema);
