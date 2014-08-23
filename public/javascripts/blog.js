
var articleForm = $('#articleForm');
var articleTextarea = $('#article-textarea');
$("#newArticleButton").click((function() {
	articleForm.removeClass('hide');
	console.log(articleTextarea);
	articleTextarea.summernote({
		height : 200
	});
}));
$('#saveArticleButton').click(function() {
	articleForm.addClass('hide');
	var sHTML = articleTextarea.code();
	var title = $('#inputTitle').val();
	var tag = $('#inputTag').val();
	var data = {};
	data.title = title;
	data.tag = tag;
	data.content = sHTML;
	$.ajax({
		url : "/a",
		type : "POST",
		context : document.body,
		data : data
	}).done(function(resp) {
		console.log(resp);
		articleTextarea.destroy();
	});
});
$('##{params.id}ConfirmButton').click(function() {
	articleForm.addClass('hide');
	articleTextarea.destroy();
}); 