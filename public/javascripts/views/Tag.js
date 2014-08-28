define(['jquery', 'underscore', 'backbone', 'article'], function($, _, Backbone) {
	var TagView = Backbone.View.extend({
		tagName : "ul",
		id : "tag",
		className : "nav nav-pills",
		attributes : {
			"role" : "tablist"
		},

		render : function() {
			var self = this;
			var tagMap = {
				"all" : {
					count : this.model.length,
					label : i18n.t('all'),
					articles : this.model
				}
			};
			this.model.forEach(function(item) {
				var tag = item.tag;
				if (tag && tag.length > 0) {
					tag.forEach(function(t) {
						var tagId = "tag_" + t.trim();
						if (tagMap[tagId]) {
							tagMap[tagId]['count']++;
						} else {
							tagMap[tagId] = {
								count : 1,
								label: t,
								articles : []
							};
						}
						tagMap[tagId].articles.push(item);
					});
				}
			}, this);
			for (var tag in tagMap) {
				var tagHtml = $('<li role="presentation"> <a href="javascript: void(0)"> <span class="badge pull-right">' + tagMap[tag].count + '</span>' + tagMap[tag].label + '</a> </li>');
				if(tag === "all")
					tagHtml.addClass('active');
				(function(tag, tagHtml) {
					$('a', tagHtml).click(function() {
						$('li', this.$el).removeClass('active');
						tagHtml.addClass('active');
						self.articlePage.createCollection(tagMap[tag].articles, tag);
					});
				})(tag, tagHtml);
				this.$el.append(tagHtml);
			}
		}
	});
	return TagView;
});
