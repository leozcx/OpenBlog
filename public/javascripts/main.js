require.config({
	paths : {
		"backbone" : "vendor/backbone",
		"underscore" : "vendor/underscore",
		"jquery" : "vendor/jquery-1.11.1",
		"bootstrap" : "vendor/bootstrap",
		"summernote" : "vendor/summernote.min",
		"pubsub" : "vendor/pubsub",
		"i18next" : "../i18next/i18next",
		"text" : "vendor/text"
	}
});

require(["jquery", "ArticlePage"], function($, ArticlePage) {
	$(function() {
		i18n.init({
			resGetPath : 'locales/__lng__/__ns__.json',
			fallbackLng : 'en-US'
		}, function() {
			window.gArticlePage = new ArticlePage().initialize();
		});

	});
});
