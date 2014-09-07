var express = require('express');
var router = express.Router();
var util = require('../util');
var i18n = require('i18next');
var flash = require('connect-flash');

router.get('/', ensureAuthenticated, function(req, res) {
	var message = req.flash('message');
	var status = req.flash('status');
	var data = {
		user : req.user
	};
	if (message && message.length > 0) {
		data.result = {
			message : message.length > 0 ? message[0] : null,
			status : status.length > 0 ? status[0] : 200
		};
	}
	res.render('profile', data);

});

router.post('/', function(req, res) {
	var data = req.body;
	util.getUser(util.adminId).then(function(user) {
		util.verifyPassword(user, data.oldPassword).then(function(result) {
			if (result)
				util.savePassword(util.adminId, data.newPassword).then(function() {
					handle(req, res, i18n.t('pwd_update_success'));
				});
			else {
				handle(req, res, i18n.t('incorrect_password'), 401);
			}
		}, function(err) {
			handle(req, res, err, 500);
		});
	}, function(err) {
		//password file doesnot exit, in that case, handle like reset password
		if (err.errno === 34) {
			util.savePassword(util.adminId, data.newPassword).then(function() {
				var user = {
					id : util.adminId,
					password : data.newPassword,
					displayName: data.displayName ? data.displayName : "admin"
				};
				req.login(user, function(err) {
					if (err) {
						return next(err);
					}
					handle(req, res, i18n.t('pwd_update_success'));
				});
			}, function(err) {
				handle(req, res, err, 500);
			});
		}
	});
});

function handle(req, res, message, code) {
	req.flash('message', message);
	req.flash('status', code ? code : 200);
	res.redirect('/profile');
}

function ensureAuthenticated(req, res, next) {
	util.getUser(util.adminId).then(function(user) {
		if (req.isAuthenticated()) {
			return next();
		}
		res.redirect('/login');
	}, function(err) {
		if (err.errno === 34) {
			return next();
		}
	});
}

module.exports = router;
