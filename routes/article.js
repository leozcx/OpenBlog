var express = require('express');
var router = express.Router();
var fs = require('fs'), path = require('path'), util = require('../util'), md = require('markdown').markdown;

router.get('/:id', function(req, res) {
	var fileName = req.params.id + ".md";
	var name = path.join(util.articlePath, fileName);
	fs.exists(name, function(exists) {
		if(exists) {
			fs.readFile(name, {encoding: 'utf8'}, function(err, data) {
				if(err) {
					return;
				}
				var html = md.toHTML(data);
				util.loadIndex().then(function(index) {
					
					var meta = index[req.params.id];
					console.log(meta)
					res.render('article', { article: {title: meta.title, content: html} });
				}, function(err) {
					console.log(err);
				});
			});
		} else {
			console.log('Dosenot exist');
		}
	});
});
	

module.exports = router;
