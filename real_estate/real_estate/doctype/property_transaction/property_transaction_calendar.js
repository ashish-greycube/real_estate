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
    gantt: false,
	get_css_class: function(data) {
		if(data.transaction_status==="Aucun") {
			return "success";
		} else if(data.transaction_status==="Payé") {
			return "warning";
		} else {
			return "danger";
		}
	},
	filters: [
		// {
		// 	"fieldtype": "Link",
		// 	"fieldname": "property",
		// 	"options": "property",
		// 	"label": __("Property")
		// }
	],
	get_events_method: "frappe.desk.calendar.get_events"
}