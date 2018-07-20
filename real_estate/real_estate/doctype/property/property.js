// Copyright (c) 2018, GreyCube Technologies and contributors
// For license information, please see license.txt
cur_frm.fields_dict['customer'].get_query = function(doc) {
	console.log("1")
	return {
		filters: {
			'customer_type': 'Owner'
		}
	}
}

frappe.ui.form.on('Property', {
	contact_person_name: function(frm) {
		frappe.call({
			method: "real_estate.real_estate.doctype.property.property.get_contact_detail",
			args:{
				"customer_name": frm.doc.contact_person_name
			},
			callback: function(r) {
				console.log(r)
				if (r.message) {
					frm.set_value('contact_email',r.message[0])
					frm.set_value('contact_phone',r.message[1])
				}
				else {
					
				}
			}
		});

	}
});
