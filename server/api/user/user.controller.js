'use strict';

var User = require('./user.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');
var jade = require('jade');

var fs = require('fs');
var pdf = require('html-pdf');
var rimraf = require('rimraf');

var nodemailer = require('nodemailer');

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'username@gmail.com',
        pass: 'password'
    }
});


require("date-format-lite")

var validationError = function(res, err) {
  return res.json(422, err);
};

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function(req, res) {
  User.find({}, '-salt -hashedPassword', function (err, users) {
    if(err) return res.send(500, err);
    res.json(200, users);
  });
};


exports.convertGuest = function(req,res){

  var userId=req.user._id;

  var newName = String(req.body.name);
  var email = String(req.body.email);
  var pass = String(req.body.password);
  var zip = String(req.body.zip);

  console.log(newName)
  console.log(email)
  console.log(pass)
  User.findById(userId, function (err, user) {

    user.name = newName;
    user.email = email;
    user.password = pass;
    user.zip = zip;
    user.save(function(err) {
      if (err) return validationError(res, err);
      res.send(200);
    });
  })

}

exports.updateUser = function(req, res) {
  
  var userId = req.user._id;
  
  // if(req.user._id !=userId){
  //   res.send(403);
  //   return;
  // }

  var answers = req.body.answers;
  var currentQuestion = String(req.body.currentQuestion);
  var currentSection = String(req.body.currentSection);
  var recommendation = req.body.recommendation
  // console.log(answers)
  // for(var a in answers){
  //   var ans = answers[a]
  //   console.log(ans.answer) 
  // }


  User.findById(userId, function (err, user) {

    console.log(user)

    user.answers = answers
    user.currentQuestion = currentQuestion
    user.currentSection = currentSection
    user.recommendation = recommendation

    user.save(function(err) {
      if (err) {
        console.log(err)
        return validationError(res, err);
      }
      res.send(200);
    });

  });

};

/**
 * Creates a new user
 */
exports.create = function (req, res, next) {
  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.role = 'user';
  console.log(newUser)
  newUser.save(function(err, user) {
    if (err) return validationError(res, err);
    var token = jwt.sign({_id: user._id }, config.secrets.session, { expiresInMinutes: 60*5 });
    res.json({ token: token });
  });
};

/**
 * Get a single user
 */
exports.show = function (req, res, next) {
  var userId = req.params.id;

  User.findById(userId, function (err, user) {
    if (err) return next(err);
    if (!user) return res.send(401);
    res.json(user.profile);
  });
};

exports.emailpdf = function(req,res,next){
  var userId = req.user._id;

  var path = './tmp/'+userId+'.pdf'
  var host = 'http://'+req.headers.host


  User.findById(userId, function (err, user) {
    if (err) return next(err);
      console.log(user.email)
      
      //for testing
      // user.email = 'byslava@gmail.com'

      var exists = fs.existsSync(path)
      
      if(exists){
        sendMail(user.email,path)
      }
      else{
        createPdf(path, user, host, function(err, pdf){
          if (err) return console.log(err);
          sendMail(user.email, pdf.filename)
        })
      }
  })


  function sendMail(email, path){
    var mailOptions = {
      from: 'Which Method <noreply@contraception.com>', // sender address
      to: email, // list of receivers
      subject: 'Your Contraception Recommendations', // Subject line
      text: 'Please see attached pdf', // plaintext body
      html: 'Please see attached pdf', // html body
      attachments: [
        {   // filename and content type is derived from path
          path: path
        },
      ]
    }

    transporter.sendMail(mailOptions, function(error, info){
        if(error){
          res.send(500, 'email failed to send')
          console.log(error);
        }else{
          return res.send(204);
          console.log('Message sent: ' + info.response);
        }
    });
  }

};


function createPdf(path, user, host,callback){

  var date = new Date()


  var params = {
    date: date.format('MMM-DD-YYYY'),
    user: user,
    red: user.recommendation.red,
    green: user.recommendation.green,
    yellow: user.recommendation.yellow,
    host: host
  }

  var fn = jade.compileFile('./server/views/recommendation.jade');
  var html = fn(params);

  var options = { filename: path, format: 'Letter' };
  pdf.create(html, options).toFile(callback)

}

exports.showRecommendation = function(req,res,next){

  var userId = req.params.id

  User.findById(userId, function (err, user) {
    if (err) return next(err);
    if (!user) return res.send(401);
    
    var host = 'http://'+req.headers.host
    // return res.render('recommendation', params)

    var path  = './tmp/'+ user.id+'.pdf'

    var exists = fs.existsSync(path)
      
    if(exists) returnPdf(path)
    else createPdf(path, user, host, function(err, pdf){
        if (err) return console.log(err);
        returnPdf(pdf.filename)
      })
  
  });

  function returnPdf(path){

      fs.readFile(path, function(err, data) {
        res.setHeader('Content-Disposition', 'inline; filename=' + "Recommendations" + '.pdf');
        res.setHeader('Content-Type', 'application/pdf');                
        res.setHeader('Content-Length', data.length);
        res.status(200).end(data,'binary');
      });
  }
}

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function(req, res) {
  User.findByIdAndRemove(req.params.id, function(err, user) {
    if(err) return res.send(500, err);
    return res.send(204);
  });
};

/**
 * Change a users password
 */
exports.changePassword = function(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findById(userId, function (err, user) {
    if(user.authenticate(oldPass)) {
      user.password = newPass;
      user.save(function(err) {
        if (err) return validationError(res, err);
        res.send(200);
      });
    } else {
      res.send(403);
    }
  });
};

/**
 * Get my info
 */
exports.me = function(req, res, next) {
  var userId = req.user._id;
  User.findOne({
    _id: userId
  }, '-salt -hashedPassword', function(err, user) { // don't ever give out the password or salt
    if (err) return next(err);
    if (!user) return res.json(401);
    res.json(user);
  });
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};


function cleanTmpFolder(){

  var uploadsDir = './tmp';
  var path = ''

  fs.readdir(uploadsDir, function(err, files) {
    console.log(err)
    if(!files) return
    files.forEach(function(file, index) {
      fs.stat(uploadsDir + '/' + file, function(err, stat) {
        var endTime, now;
        if (err) {
          return console.error(err);
        }
        now = new Date().getTime();
        endTime = new Date(stat.ctime).getTime() + 3600000;
        if (now > endTime) {
          return rimraf(uploadsDir + '/' + file, function(err) {
            if (err) {
              return console.error(err);
            }
            console.log('successfully deleted ' +file);
          });
        }
      });
    });
  });

  setTimeout(cleanTmpFolder,3600000*24)
}
cleanTmpFolder()

