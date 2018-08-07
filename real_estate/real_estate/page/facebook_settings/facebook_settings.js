frappe.pages['facebook-settings'].on_page_load = function (wrapper) {
	frappe.require([

	], function () {
		frappe.homepage = new frappe.Homepage(wrapper);
		(function(d, s, id) {
			var js, fjs = d.getElementsByTagName(s)[0];
			if (d.getElementById(id)) return;
			js = d.createElement(s); js.id = id;
			js.src = 'https://connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v3.1&appId=506334379802931&autoLogAppEvents=1';
			fjs.parentNode.insertBefore(js, fjs);
		  }(document, 'script', 'facebook-jssdk'));
	});
};


frappe.Homepage = Class.extend({
	init: function (parent) {
		frappe.ui.make_app_page({
			parent: parent,
			title: __("FaceBook Settings"),
			single_column: true
		});

		this.parent = parent;
		this.page = this.parent.page;
		this.make();
	},


	make: function () {
		var me = this;
		this.body = $('<div></div>').appendTo(this.page.main);
		var data = "";
		var $container = $(frappe.render_template('facebooksettings', data)).appendTo(this.body);
	},
});