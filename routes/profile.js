var express = require('express');
var router = express.Router();
var util = require('../util')

/* GET home page. */
router.get('/', function(req, res) {
	res.render('profile', { user: req.user });
	
});

router.post('/', function(req, res) {
	var data = req.body;
	util.savePassword("admin", data.newPassword).then(function() {
		res.json({a: "a"});
	});
});

module.exports = router;
