// Copyright (c) 2018, GreyCube Technologies and contributors
// For license information, please see license.txt

frappe.ui.form.on('Property Transaction', {
	property: function (doc, dt, dn) {
		if (cur_frm.doc.property != null) {
			$(cur_frm.fields_dict.property_details.wrapper).html('');
			frappe.call({
				method: "real_estate.real_estate.doctype.property_transaction.property_transaction.get_property_detail",
				args: {
					property_name: cur_frm.doc.property
				},
				callback: function (r) {
					if (!r.message) {
						const html = `There is no property detail for ` + cur_frm.doc.property
						$(cur_frm.fields_dict.property_details.wrapper).html(html);
					}
					const property_data = r.message[0];
					if (property_data) {
						const html = `
					<hr>
					<div style="font-weight: bold">Property Description</div>
                        <table class="table table-bordered">
                            <tbody>
							   <tr><td><span style="font-weight: bold">${__("Owner: ")}</span>${property_data.customer}</td></tr>
							   <tr><td><span style="font-weight: bold">${__("Property: ")}</span>${property_data.property_name}</td></tr>
							   <tr><td><span style="font-weight: bold">${__("Floor: ")}</span>${property_data.floor}</td></tr>
							   <tr><td><span style="font-weight: bold">${__("Address: ")}</span>${property_data.address}</td></tr>
							   <tr><td><span style="font-weight: bold">${__("Type: ")}</span>${property_data.property_type}</td></tr>
                            </tbody>
                        </table>`
						$(cur_frm.fields_dict.property_details.wrapper).html(html);
					}
				}
			});
		}
	},
	refresh: function (frm) {
		var so = frm.get_docfield("client");
		so.get_route_options_for_new_doc = function (field) {
			return {
				"customer_type": "Client",
			}
		}
	},
	setup: function (frm) {
		frm.fields_dict['client'].get_query = function (doc) {
			return {
				query: "real_estate.real_estate.doctype.property_transaction.property_transaction.get_client"
			};

		};
	}
});