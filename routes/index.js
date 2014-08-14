var express = require('express');
var router = express.Router();
var fs = require('fs');
var markdown = require('markdown');
var md = markdown.markdown;

/* GET home page. */
router.get('/', function(req, res) {
	
	var folder = '/Users/Leo/Documents/Workspace0804/OpenBlog/articles';
	fs.readdir(folder, function(err, files) {
		var articles = [];
		for(var i = 0; i < files.length; i++) {
			var file = files[i];
			if(file !== "." && file !== "..") {
				var name = folder + "/" + file;
				fs.readFile(name, {encoding: "utf8"}, function(err, data) {
					var html = md.toHTML(data);
					articles.push({title: i, 'abstract': html});
					console.log(files);
					console.log(i)
					console.log("----")
					if(i == files.length)
						res.render('index', { articles: articles, page: 'article' });
				});
			}
		}
	});
});

module.exports = router;
