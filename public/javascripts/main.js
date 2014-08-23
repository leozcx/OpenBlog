require.config({
	paths : {
		"backbone" : "vendor/backbone",
		"underscore" : "vendor/underscore",
		"jquery" : "vendor/jquery-1.11.1",
		"bootstrap" : "vendor/bootstrap",
		"summernote" : "vendor/summernote.min",
		"pubsub" : "vendor/pubsub",
		"i18next" : "../i18next/i18next",
		"articlesView" : "views/articles",
		"text" : "vendor/text"
	}
});

require(["jquery", "dialog", "articlesView", "pubsub", "i18next", "bootstrap", "summernote"], function($, dialog, ArticlesView) {
	$(function() {
		i18n.init({
			resGetPath : 'locales/__lng__/__ns__.json',
			fallbackLng : 'en-US'
		});
		$.ajax({
			url : "/articles",
			type : "GET",
			context : document.body
		}).done(function(resp) {
			var abstract = new ArticlesView({
				model : resp
			});
			abstract.render();
			$('section').append(abstract.el);
		}).fail(function(resp) {
			publish('progress/show', [$.t('saving'), 'label-error', 0]);
		});

		subscribe("progress/show", function(message, className, duration) {
			var progress = $('#progress');
			progress.addClass( className ? className : 'label-info');
			progress.removeClass('hide');
			progress.html(message);
			if (duration === 0) {
				return;
			}
			setTimeout(function() {
				progress.addClass('hide');
			}, duration ? duration : 4000);
		});

		subscribe("progress/hide", function() {
			var progress = $('#progress');
			progress.addClass('hide');
			progress.html('');
		});
		var articleForm = $('#articleForm');
		var articleTextarea = $('#article-textarea');
		$("#newArticleButton").click((function() {
			articleForm.removeClass('hide');
			articleTextarea.summernote({
				height : 200
			});
			$('html, body, .container').animate({
				scrollTop : $(document).height()
			}, 300);
		}));
		$('#saveArticleButton').click(function() {
			publish('progress/show', [$.t('saving'), 'label-info']);
			articleForm.addClass('hide');
			var title = $('#inputTitle').val();
			var tag = $('#inputTag').val();
			var data = new FormData();
			data.append('title', title);
			data.append('tag', tag);
			var files = $('#inputContent')[0].files;
			if (files.length > 0) {
				data.append('file', files[0]);
			} else {
				var sHTML = articleTextarea.code();
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
				articleTextarea.destroy();

			}).fail(function(resp) {
				publish('progress/show', [$.t('saving'), 'label-error', 0]);
			});
		});
		$('#discardAritcleButton').click(function() {
			dialog.init($.t('confirm_discard'), function() {
				articleForm.addClass('hide');
				articleTextarea.destroy();
			}, function() {
				console.log('cancel');
			});
			dialog.show();
		});

		//connect abstract delete action
		$('[id $= DeleteButton]').each(function(i, item) {
			$(this).click(function() {
				var articleId = $(this).data('article-id');
				dialog.init($.t('confirm_delete'), function() {
					var articlePanelId = articleId + "panel";
					publish('progress/show', [$.t('deleting'), 'label-info', 0]);
					$.ajax({
						url : "/a/" + articleId,
						type : "DELETE",
						context : document.body
					}).done(function(resp) {
						$("#" + articlePanelId).remove();
						publish('progress/show', [$.t('deleted'), 'label-info']);
					}).fail(function(err) {
						publish('progress/show', [err, 'label-error', 0]);
					});
				}, function() {
					console.log('cancel');
				});
				dialog.show();
			});
		});
	});
});
