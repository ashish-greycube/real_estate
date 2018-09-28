// Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
// License: GNU General Public License v3. See license.txt

frappe.views.calendar["Property Transaction"] = {
	field_map: {
		"start": "transaction_date",
		"end": "transaction_date",
		"id": "name",
        "title": "transaction_type",
		"status":"transaction_status",
		"allDay": "allDay",
	},
	get_css_class: function(data) {
		if(data.transaction_status==="Aucun") {
			return "success";
		} else if(data.transaction_status==="Payé") {
			return "warning";
		} else {
			return "danger";
		}
	},
	
	onload: function(listview) {
			// this.remove();
			this.clear_filters();
			// frappe.route_options = {"customer": ["!=", "2"]}
			console.log('ii')
	}
}