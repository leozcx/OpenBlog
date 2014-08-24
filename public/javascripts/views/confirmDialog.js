define(['jquery', 'underscore', 'backbone', 'text!views/templates/confirmDialog.html'], function($, _, Backbone, template) {
	var ConfirmDialogView = Backbone.View.extend({
		initialize : function() {
			this.titleContent = i18n.t('confirm');
			this.closeLabel = i18n.t('close');
			this.bodyContent = i18n.t('confirm');
			this.confirmLabel = i18n.t('confirm');
			this.cancelLabel = i18n.t('cancel');
			this.confirmButtonId = this.id + "_confirm";
			this.cancelButtonId = this.id + "_cancel";
		},

		attributes : {
			"class" : "modal fade",
			"tabindex" : "-1",
			"role" : "dialog",
			"aria-labelledby" : "myModalLabel",
			"aria-hidden" : "true"
		},

		events : function() {
			var ret = {};
			ret["click #" + this.confirmButtonId] = this.confirmClicked;
			ret["click #" + this.cancelButtonId] = this.cancelClicked;
			return ret;
		},

		confirmClicked : function() {
			$('#' + this.id).modal('hide');
			this.onConfirm && this.onConfirm();
		},

		cancelClicked : function() {
			this.onCancel && this.onCancel();
		},

		render : function() {
			this.$el.append(_.template(template, this));
			return this;
		},

		show : function() {
			$('#' + this.id).modal();
		}
	});
	return ConfirmDialogView;
});
