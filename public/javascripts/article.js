define(["jquery", "dialog", "views/articles", "views/CreateArticle", "collections/articles", "views/Tag", "pubsub", "i18next", "bootstrap", "summernote"], function($, dialog, ArticlesView, CreateArticleView, ArticleCollection, TagView) {

	var ArticlePage = function() {
		return {
			collectionMap : {},

			initialize : function() {
				this.fetch();
				this.initEditor();
				this.initEvent();
			},

			fetch : function() {
				var self = this;
				$.ajax({
					type : "GET",
					url : "/article"
				}).done(function(resp) {
					self.createTag(resp);
					self.createCollection(resp, 'all');
				}).fail(function(error) {
					publish('progress/show', [error, 'label-error', 0]);
				});
			},

			initEditor : function() {
				var articleForm = $('#articleForm');
				var articleTextarea = $('#article-textarea');
				var self = this;
				$("#newArticleButton").click(function() {
					var createArticleView = new CreateArticleView();
					createArticleView.onSave = function(a) {
						self.collectionMap['all'].add(a);
					};
					createArticleView.render();
					$('section').append(createArticleView.el);
					createArticleView.show();
					$('html, body, .container').animate({
						scrollTop : $(document).height()
					}, 300);
				});
			},

			initEvent : function() {
				subscribe("progress/show", function(message, className, duration) {
					var progress = $('#progress');
					progress.addClass( className ? className : 'label-info');
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
			},

			createCollection : function(articles, tag) {
				tag = tag ? tag : 'all';
				if (this.collectionMap[tag] == null) {
					this.collectionMap[tag] = new ArticleCollection(articles, {});
				}
				if (this.articlesView)
					this.articlesView.remove();

				this.articlesView = new ArticlesView({
					collection : this.collectionMap[tag]
				});
				this.articlesView.render();
				$('section').append(this.articlesView.el);
			},

			createTag : function(articles) {
				tagView = new TagView({
					model : articles
				});
				tagView.articlePage = this;
				tagView.render();
				$('section').append(tagView.el);
			}
		};
	};

	return ArticlePage;
});
