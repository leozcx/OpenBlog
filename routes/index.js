var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	var articles = [
	                {title: "title1", 'abstract': "abs1"},
	                {title: 'title2', 'abstract': 'abs2'}];
  res.render('index', { articles: articles, page: 'article' });
});

module.exports = router;
