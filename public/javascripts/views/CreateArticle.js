define(['jquery', 'underscore', 'backbone', 'text!views/templates/CreateArticle.html',  'views/confirmDialog'], function($, _, Backbone, template, ConfirmDialog) {
	var CreateArticleView = Backbone.View.extend({
		
		events: function() {
			var ret = {
				"click #discardArticleButton": "discard",
				"click #saveArticleButton": "save"
			};
			
			return ret;
		},
		
		discard: function() {
			this.confirmDialog.show();
		},
		
		save: function() {
			var self = this;
			publish('progress/show', [$.t('saving'), 'label-info']);
			var title = $('#inputTitle').val();
			var tag = $('#inputTag').val();
			var data = new FormData();
			data.append('title', title);
			data.append('tag', tag);
			var files = $('#inputContent')[0].files;
			if (files.length > 0) {
				data.append('file', files[0]);
			} else {
				var sHTML = $('#articleTextarea').code();
				data.append('content', sHTML);
			}
			$.ajax({
				url : "/a",
				type : "POST",
				context : document.body,
				data : data,
				contentType : false,
				processData : false
			}).done(function(resp) {
				publish('progress/show', [$.t('saved'), 'label-info']);
				self.hide();
				self.onSave(resp);
			}).fail(function(resp) {
				publish('progress/show', [$.t('saving'), 'label-error', 0]);
			});
		},

		show : function() {
			$('#createArticleForm').removeClass('hide');
			$('#articleTextarea').summernote({
				height : 200
			});
		},
		
		hide: function() {
			$('#createArticleForm').addClass('hide');
			$('#articleTextarea').destroy();
		},

		render : function() {
			var compiledTemplate = _.template(template, this);
			var self = this;
			this.$el.append(compiledTemplate);
			this.confirmDialog = new ConfirmDialog({
				id : "discardConfirmDialog"
			});
			this.confirmDialog = _.extend(this.confirmDialog, {
				bodyContent : i18n.t('confirm_discard'),
				onConfirm: function() {
					self.hide();
				}
			});
			this.confirmDialog.render();
			this.$el.append(this.confirmDialog.el);
		}
	});
	return CreateArticleView;
});
