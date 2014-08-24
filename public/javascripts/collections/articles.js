define(['underscore', 'backbone',
// Pull in the Model module from above
'models/article'], function(_, Backbone, ArticleModel) {
	var ArticleCollection = Backbone.Collection.extend({
		model : ArticleModel,
		url: "/articles"
	});
	return ArticleCollection;
}); 