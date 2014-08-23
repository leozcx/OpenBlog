define(['jquery', 'underscore', 'backbone', 'text!views/templates/article.html'], function($, _, Backbone, template) {
	var ArticleView = Backbone.View.extend({
		events : function() {
			var delButtonId = this.model.id + "_delete";
			var ret = {};
			ret["click #" + delButtonId] = function() {
				console.log(this.model.id);
			};
			return ret;
		},

		render : function() {
			var compiledTemplate = _.template(template, this.model);
			this.$el.append(compiledTemplate);
		}
	});
	return ArticleView;
});
