define(['underscore', 'backbone', 'views/article', 'views/confirmDialog', 'collections/articles'], function(_, Backbone, ArticleView, ConfirmDialog, ArticleCollection) {
	var ArticlesView = Backbone.View.extend({
		defaults : {
			model : null
		},

		initialize : function() {
			var self = this;
			this.collection = new ArticleCollection();
			this.collection.fetch({
				"success" : function(resp) {
					self.render();
				},
				"fail" : function(error) {
					publish('progress/show', [i18n.t('saving'), 'label-error', 0]);
				}
			});
		},

		render : function() {
			this.articleMap = {};
			this.collection.forEach(function(model) {
				var article = model.attributes;
				var template = new ArticleView({
					model : article
				});
				template = _.extend(template, {
					onDelete : function() {
						confirmDialog.show();
						confirmDialog.articleId = article.id;
					}
				});
				this.articleMap[article.id] = template;
				template.render();
				this.$el.append(template.el);
			}, this);

			var confirmDialog = new ConfirmDialog({
				id : "deleteArticleConfirmDialog"
			});
			var self = this;
			confirmDialog = _.extend(confirmDialog, {
				bodyContent : i18n.t('confirm_delete'),
				onConfirm : function() {
					$.ajax({
						url : "/a/" + this.articleId,
						type : "DELETE",
						context : document.body
					}).done(function(resp) {
						self.articleMap[confirmDialog.articleId].destroy();
						publish('progress/show', [$.t('deleted'), 'label-info']);
					}).fail(function(err) {
						publish('progress/show', [err, 'label-error', 0]);
					});
				}
			});
			confirmDialog.render();
			this.$el.append(confirmDialog.el);
		}
	});
	return ArticlesView;
});
