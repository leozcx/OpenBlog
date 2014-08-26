define(['underscore', 'backbone', 'views/article', 'views/confirmDialog'], function(_, Backbone, ArticleView, ConfirmDialog) {
	var ArticlesView = Backbone.View.extend({
		defaults : {
			model : null
		},

		initialize : function() {
			
		},

		render : function() {
			var self = this;
			var confirmDialog = new ConfirmDialog({
				id : "deleteArticleConfirmDialog"
			});
			confirmDialog = _.extend(confirmDialog, {
				bodyContent : i18n.t('confirm_delete'),
				onConfirm : function() {
					$.ajax({
						url : "/article/" + this.articleId,
						type : "DELETE",
						context : document.body
					}).done(function(resp) {
						var view = self.articleMap[confirmDialog.articleId];
						view.remove();
						publish('progress/show', [$.t('deleted'), 'label-info']);
					}).fail(function(err) {
						publish('progress/show', [err, 'label-error', 0]);
					});
				}
			});
			confirmDialog.render();
			this.articleMap = {};
			if(this.collection.length > 0) {
				this.collection.forEach(function(article) {
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
			} else {
				var html = '<div class="panel panel-default"><div class="panel-body">' + i18n.t('no_article') + '</div></div>';
				this.$el.append(html);
			}
			
			this.$el.append(confirmDialog.el);
		}
	});
	return ArticlesView;
});
