define(['underscore', 'backbone', 'views/article', 'views/confirmDialog'], function(_, Backbone, ArticleView, ConfirmDialog) {
	var ArticlesView = Backbone.View.extend({
		defaults : {
			model : null
		},

		initialize : function() {
			this.listenTo(this.collection, "add", function(model) {
				$('#noArticlePanel').remove();
				var view = this.createArticleView(model);
				
				this.$el.prepend(view.el);
			});
			this.listenTo(this.collection, "remove", function() {
				if(this.collection.length == 0) {
					this.createNoArticlePanel();
				}
			});
		},
		
		createArticleView: function(article) {
			var self = this;
			var template = new ArticleView({
				model : article
			});
			template.listenTo(article, "sync", function() {
				template.remove();
			});
			template = _.extend(template, {
				onDelete : function() {
					self.confirmDialog.show();
					self.confirmDialog.article = article;
				}
			});
			template.render();
			return template;
		},

		render : function() {
			var self = this;
			this.confirmDialog = new ConfirmDialog({
				id : "deleteArticleConfirmDialog"
			});
			this.confirmDialog = _.extend(this.confirmDialog, {
				bodyContent : i18n.t('confirm_delete'),
				onConfirm : function() {
					this.article.destroy({success: function(model, resp) {
						publish('progress/show', [$.t('deleted'), 'label-info']);
					}, fail: function(err) {
						publish('progress/show', [err, 'label-error', err]);
					}, wait: true});
				}
			});
			this.confirmDialog.render();
			if(this.collection.length > 0) {
				this.collection.each(function(article) {
					var view = this.createArticleView(article);
					this.$el.append(view.el);
				}, this);
			} else {
				this.createNoArticlePanel();
			}
			
			this.$el.append(this.confirmDialog.el);
		},
		
		createNoArticlePanel: function() {
			var html = '<div class="panel panel-default" id="noArticlePanel"><div class="panel-body">' + i18n.t('no_article') + '</div></div>';
			this.$el.append(html);
		}
	});
	return ArticlesView;
});
