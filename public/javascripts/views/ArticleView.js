define(['jquery', 'underscore', 'backbone', 'text!views/templates/ArticleView.html', 'util'], function($, _, Backbone, template, Util) {
	var ArticleView = Backbone.View.extend({

		initialize : function() {
			this.delButtonId = this.model.id + "_delete";
			this.createdOn = this.model.get('createdOn');
			this.createdOn = this.createdOn ? Util.formatDate(new Date(this.createdOn), "yyyy-MM-dd") : "";
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
			if(window.user == undefined) {
				this.$('#'+this.delButtonId).remove();
			}
		}
	});
	return ArticleView;
});
