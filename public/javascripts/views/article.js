define(['jquery', 'underscore', 'backbone', 'text!views/templates/article.html'], function($, _, Backbone, template) {
	var ArticleView = Backbone.View.extend({

		initialize : function() {
			this.delButtonId = this.model.id + "_delete";
		},

		events : function() {
			var ret = {};
			ret["click #" + this.delButtonId] = this.deleteClicked;
			return ret;
		},

		deleteClicked : function() {
			this.onDelete && this.onDelete();
		},
		
		destroy: function() {
			this.undelegateEvents();
			this.$el.remove();
		},

		render : function() {
			var compiledTemplate = _.template(template, this);
			this.$el.append(compiledTemplate);
		}
	});
	return ArticleView;
});
