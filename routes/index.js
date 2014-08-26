var express = require('express');
var router = express.Router();
var fs = require('fs');
var markdown = require('markdown');
var md = markdown.markdown;

/* GET home page. */
router.get('/', function(req, res) {
	res.render('index', { admin: true });
	
});



module.exports = router;
