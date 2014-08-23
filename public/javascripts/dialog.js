define(["jquery"], function($) {
	function show() {
		$('#confirmDialog').modal();
	}
	
	function init(content, onConfirm, onCancel) {
		$('#confirmDialogContent').html(content);
		var confirmButton = $('#confirmDialogConfirmButton');
		confirmButton.unbind('click');
		confirmButton.click(onConfirm);
		var cancelButton = $('#confirmDialogCancelButton');
		cancelButton.click(onCancel);
	}
	
	return {
		"show": show,
		"init": init
	};
});
