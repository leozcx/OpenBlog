define(['underscore', 'backbone'], function(_, Backbone) {
	var ArticleModel = Backbone.Model.extend({
		defaults: {
			id: "",
			abstract: ""
		}
	});
	return ArticleModel;
});
