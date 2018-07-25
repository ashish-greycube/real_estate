// Copyright (c) 2018, GreyCube Technologies and contributors
// For license information, please see license.txt

frappe.ui.form.on('Property', {
	contact_person_name: function (frm) {
		frm.set_value('contact_email', "")
		frm.set_value('contact_phone', "")
		frappe.call({
			method: "real_estate.real_estate.doctype.property.property.get_contact_detail",
			args: {
				"customer_name": frm.doc.contact_person_name
			},
			callback: function (r) {
				if (r.message) {
					frm.set_value('contact_email', r.message[0][0])
					frm.set_value('contact_phone', r.message[0][1])
				}
			}
		});

	},
	setup: function (frm) {
		frm.fields_dict['customer'].get_query = function (doc) {
			return {
				query: "real_estate.real_estate.doctype.property.property.get_owner"
			}
		}
	}
});