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

require([ "jquery", "dialog", "views/articles", "views/CreateArticle", "collections/articles",
		"pubsub", "i18next", "bootstrap", "summernote" ], function($, dialog,
		ArticlesView, CreateArticleView, ArticleCollection) {
	var collection = null;
	var articlesView = null;
	
	function createCollection(articles) {
		if(collection == null) {
			collection = new ArticleCollection(articles, {});
			articlesView = new ArticlesView({
				collection: collection
			});
			articlesView.render();
			$('section').append(articlesView.el);
		}
	}
	
	$(function() {
		// ---------------------
		
		i18n.init({
			resGetPath : 'locales/__lng__/__ns__.json',
			fallbackLng : 'en-US'
		}, function() {
			$.ajax({
				type : "GET",
				url : "/article"
			}).done(function(resp) {
				createCollection(resp);
			}).fail(function(error) {
				publish('progress/show', [ error, 'label-error', 0 ]);
			});

			var articleForm = $('#articleForm');
			var articleTextarea = $('#article-textarea');
			$("#newArticleButton").click((function() {
				var createArticleView = new CreateArticleView();
				createArticleView.onSave = function(a) {
					collection.add(a);
				};
				createArticleView.render();
				$('section').append(createArticleView.el);
				createArticleView.show();
				$('html, body, .container').animate({
					scrollTop : $(document).height()
				}, 300);
			}));
		});

		subscribe("progress/show", function(message, className, duration) {
			var progress = $('#progress');
			progress.addClass(className ? className : 'label-info');
			progress.removeClass('hide');
			progress.html(message);
			if (duration === 0) {
				return;
			}
			setTimeout(function() {
				progress.addClass('hide');
			}, duration ? duration : 4000);
		});

		subscribe("progress/hide", function() {
			var progress = $('#progress');
			progress.addClass('hide');
			progress.html('');
		});
	});
});
