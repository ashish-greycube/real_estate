// Copyright (c) 2018, GreyCube Technologies and contributors
// For license information, please see license.txt

window.fbAsyncInit = function () {
	console.log("inside")
	console.log(cur_frm.doc.fb_app_id)
	FB.init({
		// appId: '506334379802931',
		appId: cur_frm.doc.fb_app_id,
		autoLogAppEvents: true,
		xfbml: true,
		version: 'v3.1'
	});
};



(function (d, s, id) {
	var js, fjs = d.getElementsByTagName(s)[0];
	if (d.getElementById(id)) {
		return;
	}
	js = d.createElement(s);
	js.id = id;
	js.src = "https://connect.facebook.net/en_US/sdk.js";
	fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

frappe.ui.form.on('Property', {


	customer: function (frm) {
		frm.set_value('contact_email', "")
		frm.set_value('contact_phone', "")
		if (frm.doc.customer != undefined) {
			frappe.call({
				method: "real_estate.real_estate.doctype.property.property.get_contact_detail",
				args: {
					"customer_name": frm.doc.customer
				},
				callback: function (r) {
					if (r.message) {
						frm.set_value('contact_person_name', r.message[0][0] + ' ' + r.message[0][1])
						frm.set_value('contact_email', r.message[0][2])
						frm.set_value('contact_phone', r.message[0][3])
					}
				}
			});
		}

	},
	setup: function (frm) {
		frm.fields_dict['customer'].get_query = function (doc) {
			return {
				query: "real_estate.real_estate.doctype.property.property.get_owner"
			}
		}
	},
	refresh: function (frm, cdt, cdn) {
		frm.set_value('show_in_website', 1)
		if(cur_frm.get_files().length!=0){
			
			// Use images that are at least 1200 x 630 pixels for the best display on high resolution devices. At the minimum, you should use images that are 600 x 315 pixels
			file_0_detail = frappe.urllib.get_base_url() + cur_frm.get_files()[0].file_url
			var img = new Image();
			img.onload = function(){
				frm.set_value('image_0_width', this.width)
				frm.set_value('image_0_height',  this.height)
			};
			img.src = file_0_detail;
			// getMeta(file_0_detail);
			// file_1_detail = frappe.urllib.get_base_url() + cur_frm.get_files()[1].file_url
			html = '<meta property="og:image"  content="' + file_0_detail + '"/>'
			property_url=frappe.urllib.get_base_url() +'/'+frm.doc.route
			console.log(property_url)
			frm.set_value('image_0_html', file_0_detail)
			frm.set_value('base_url', frappe.urllib.get_base_url())
			// frm.set_value('image_1_html', file_1_detail)
			console.log(html)
			// $(html).appendTo($('body'))
			cur_frm.refresh_field('image_0_html')
	

			frm.add_custom_button("Post to FB",
				function () {
					FB.ui({
						method: 'share',
						display: 'popup',
						href:property_url
					}, function (response) {});
	
				}, "fa fa-retweet",
				"btn btn-primary btn-sm primary-action"
			);
			
		}


	},
	post_to_fb: function (frm) {
		return (
			frm.call({
				method: 'publish_to_facebook',
				doc: frm.doc,
				freeze: true,
				freeze_message: "Hello",
				callback: (r) => {

					if (r.message) {
						console.log(r.message)
						frappe.msgprint(r.message.id);
					}
				}
			})
		);
	}
});