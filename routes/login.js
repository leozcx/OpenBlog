var express = require('express');
var router = express.Router();
var passport = require('passport');


router.get('/', function(req, res) {
	res.render('login');
});

router.post('/', function(req, res) {
	var data = req.body;
//	res.redirect('../');
	
	(passport.authenticate('local', { successRedirect: '../',
        failureRedirect: '/login',
        failureFlash: true }))();
});

module.exports = router;
