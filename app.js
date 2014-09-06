var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var i18n = require('i18next');
var multer = require('multer');
var passport = require('passport'), LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');

var routes = require('./routes/index');
var resume = require('./routes/resume');
var article = require('./routes/article');
var login = require('./routes/login');
var profile = require('./routes/profile');

var util = require('./util');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
app.use(multer({ dest: util.articlePath,
	rename: function (fieldname, filename) {
	    return util.generateId();
	  }}));

app.use(i18n.handle);
i18n.registerAppHelper(app);
i18n.serveClientScript(app)
    .serveDynamicResources(app)
    .serveMissingKeyRoute(app);

//passport
passport.use(new LocalStrategy(function(username, password, done) {
	util.getUser(username).then(function(user) {
		util.verifyPassword(user, password).then(function(result) {
			if(result)
				return done(null, user);
			else {
				return done(null, false, {'message': i18n.t('invalid_user')})
			}	
		}, function(err) {
			return done(err, false);
		});
	});
}));

app.use('/', routes);
app.use('/profile', profile);
app.use('/resume', resume);
app.use(util.articleUrl, article);

app.route('/login').get(function(req, res) {
	var error = req.flash('error');
	var data = error.length > 0 ? {message: error[0]} : null;
	res.render('login', data);
}).post(passport.authenticate('local', { successRedirect: '../',
        failureRedirect: '/login',
        failureFlash: true }));
passport.serializeUser(function(user, done) {
	done(null, user.id);
});
passport.deserializeUser(function(id, done) {
	done(null, {"id": id, "displayName": "amdin"});
});
app.get('/logout', function(req, res){
	req.logout();
	res.redirect('/');
});

util.init();
i18n.init({ resGetPath: 'public/locales/__lng__/__ns__.json',
	fallbackLng: 'en-US' }, function() {
	});

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
