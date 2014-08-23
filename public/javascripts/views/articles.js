define(['underscore', 'backbone',
// Pull in the Model module from above
'views/article'], function(_, Backbone, ArticleView) {
	var ArticleCollection = Backbone.View.extend({
		defaults : {
			model : null
		},

		render : function() {
			this.model.forEach(function(article) {
				var template = new ArticleView({model: article});
				template.render();
				this.$el.append(template.el);
			}, this);
		}
	});
	return ArticleCollection;
});
