var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
	res.render('login');
});

router.post('/', function(req, res) {
	var data = req.body;
	res.redirect('../');
});

module.exports = router;
