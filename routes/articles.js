var express = require('express');
var router = express.Router();
var fs = require('fs');
var markdown = require('markdown');
var md = markdown.markdown;
var async = require('async');
var util = require('../util');

/* GET home page. */
router.get('/', function(req, res) {
	util.load().then(function(articles) {
		async.each(articles, function(article, callback) {
			article.url = util.articleUrl + "/" + article.file;
			callback();
		}, function(err) {
			if (!err) {
				res.json(articles);
			}
		});
	}, function(err) {
		console.log(err);
	});

});

module.exports = router;
