define([ 'dojo/_base/declare', 'dijit/form/Button', 'dojo/dom-construct' ], function(declare, Button,
		domConstruct) {

	var m = declare([], {
		constructor: function(holder) {
			this.hodler = holder
		},
		holder: null,
		init : function(holder) {
			console.log(this.holder)
			var myButton = new Button({
				label : "Click me!",
				onClick : function() {
					// Do something:
					console.log("clicked, eva.")
				}
			}, holder).startup();
		}
	});

	return m;
});