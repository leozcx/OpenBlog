var express = require("express")
var router = express.Router();

router.get('/', function(req, res) {
	res.render('resume', {page: 'resume'});
});

module.exports = router;