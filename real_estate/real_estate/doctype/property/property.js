// Copyright (c) 2018, GreyCube Technologies and contributors
// For license information, please see license.txt

frappe.ui.form.on('Property', {
	customer: function (frm) {
		frm.set_value('contact_email', "")
		frm.set_value('contact_phone', "")
		if (frm.doc.customer!=undefined){
		frappe.call({
			method: "real_estate.real_estate.doctype.property.property.get_contact_detail",
			args: {
				"customer_name": frm.doc.customer
			},
			callback: function (r) {
				if (r.message) {
					frm.set_value('contact_person_name', r.message[0][0]+' '+r.message[0][1])
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
	post_to_fb: function(frm) {
		return( 
			frm.call({
			method:'publish_to_facebook',
			doc: frm.doc,
			freeze: true,
			freeze_message:"Hello",
			callback: (r) => {
				
				if(r.message){
					console.log(r.message)
					frappe.msgprint(r.message.id);
				}
			}})	
	);
	}
});