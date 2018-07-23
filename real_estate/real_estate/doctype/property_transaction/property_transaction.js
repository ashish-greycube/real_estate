// Copyright (c) 2018, GreyCube Technologies and contributors
// For license information, please see license.txt

frappe.ui.form.on('Property Transaction', {
	refresh: function(frm) {

	}
});
frappe.ui.form.on('Property Transaction', {
	setup: function(frm) {
		frm.fields_dict['client'].get_query = function(doc){
	return {
		query: "real_estate.real_estate.doctype.property_transaction.property_transaction.get_client"
	};

		}
	}

})