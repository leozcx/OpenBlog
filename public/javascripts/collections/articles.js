define(['underscore', 'backbone',
'models/article'], function(_, Backbone, ArticleModel) {
	var ArticleCollection = Backbone.Collection.extend({
		defaults: {
			model: ArticleModel
		}
	});
	return ArticleCollection;
}); 