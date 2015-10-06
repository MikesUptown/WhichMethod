'use strict';

var express = require('express');
var controller = require('./user.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.post('/emailpdf', auth.isAuthenticated(), controller.emailpdf);

router.get('/', auth.hasRole('admin'), controller.index);

router.get('/csv/:type', controller.csv);


router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.get('/me', auth.isAuthenticated(), controller.me);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);

router.put('/:id/guest', auth.isAuthenticated(), controller.convertGuest);

router.post('/:id', auth.isAuthenticated(), controller.updateUser);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', controller.create);

module.exports = router;
