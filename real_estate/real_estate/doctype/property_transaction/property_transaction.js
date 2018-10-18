// Copyright (c) 2018, GreyCube Technologies and contributors
// For license information, please see license.txt

cur_frm.fields_dict['property'].get_query = function (doc, cdt, cdn) {
	transaction_type = doc.transaction_type
	if (transaction_type == 'Louer') {
		return {
			filters: {
				property_status: ["in", ["A louer", "À louer et à vendre"]],
				'docstatus': 0,
				disable:0
			}
		}
	} else if (transaction_type == 'Vente') {
		return {
			filters: {
				property_status: ["in", ["À vendre", "À louer et à vendre"]],
				'docstatus': 0,
				disable:0
			}
		}
	} else if (transaction_type == 'Visite') {
		return {
			filters: {
				property_status: ["in", ["A louer","À vendre", "À louer et à vendre"]],
				'docstatus': 0,
				disable:0
			}
		}
	}else if (transaction_type == '') {
		return {
			filters: {
				property_status: ["in", ["A louer","À vendre", "À louer et à vendre"]],
				'docstatus': 0,
				disable:0
			}
		}
	}
};

frappe.ui.form.on('Property Transaction', {

	before_submit: function (frm) {
		console.log("inside submit")
		console.log(frm.doc.status)
		console.log(frm.transaction_type)
		transaction_type = frm.doc.transaction_type
		property = frm.doc.property
		if (transaction_type == 'Visite') {
			frm.set_value('transaction_status', 'Frais de visite reçus')
			frm.refresh_field('transaction_status')
		}

	},

	validate: function (frm) {
		console.log("inside validate")
		transaction_type = frm.doc.transaction_type
		is_paid_by_client = frm.doc.is_paid_by_client
		is_paid_by_owner = frm.doc.is_paid_by_owner
		property = frm.doc.property
		console.log(frm.doc.status)
		console.log(transaction_type)
		if (transaction_type == 'Louer' || transaction_type == 'Vente') {
			if (is_paid_by_client == 0 && is_paid_by_owner == 0) {
				frm.set_value('transaction_status', 'Non Payé')
			}
			if (is_paid_by_client == 1 && is_paid_by_owner == 0) {
				frm.set_value('transaction_status', 'Propriétaire non payé')
			}
			if (is_paid_by_client == 0 && is_paid_by_owner == 1) {
				frm.set_value('transaction_status', 'Client non payé')
			}
			if (is_paid_by_client == 1 && is_paid_by_owner == 1) {
				frm.set_value('transaction_status', 'Payé')
			}
			if (transaction_type == 'Louer') {
				set_property_status = "Loué"
			}
			if (transaction_type == 'Vente') {
				set_property_status = "Vendu"
			}
			frappe.call({
				"method": "frappe.client.set_value",
				"args": {
					"doctype": "Property",
					"name": property,
					"fieldname": "property_status",
					"value": set_property_status
				}
			});
			frm.refresh_field('property_status')
			frm.refresh_field('transaction_status')
		}
	},

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
		var so = frm.get_docfield("customer");
		so.get_route_options_for_new_doc = function (field) {
			return {
				"customer_type": "Client",
			}
		}
		cur_frm.add_fetch("property", "property_status", "property_status");
	},
	rent_duration: function (frm) {
		if (frm.doc.rent_duration != "") {
			frm.set_value("rent_end_date", frappe.datetime.add_months(frm.doc.rent_start_date, frm.doc.rent_duration));
			frm.set_value("total_rent_amount", frm.doc.rent_price * frm.doc.rent_duration);
			frm.set_value("total_amount", frm.doc.total_rent_amount+frm.doc.deposit+frm.doc.notary_fees);
		}
	},
	deposit: function (frm) {
		if (transaction_type == 'Louer') {

		frm.set_value("total_amount", frm.doc.total_rent_amount+frm.doc.deposit+frm.doc.notary_fees);	
		}
	},
	notary_fees: function (frm) {
		if (transaction_type == 'Louer') {
		frm.set_value("total_amount", frm.doc.total_rent_amount+frm.doc.deposit+frm.doc.notary_fees);	
		}
	},
	already_paid_amount: function (frm) {
		frm.set_value("outstanding_amount", frm.doc.total_amount-frm.doc.already_paid_amount);	
	},
	total_amount: function (frm) {
		frm.set_value("outstanding_amount", frm.doc.total_amount-frm.doc.already_paid_amount);	
	},
	rent_start_date: function (frm) {
		if (frm.doc.rent_start_date != "") {
			frm.set_value("rent_end_date", frappe.datetime.add_months(frm.doc.rent_start_date, frm.doc.rent_duration));
		}
	},
	transaction_type: function (frm) {

		//Clear all fileds when transaction type changes
		frm.set_value('property', '')
		frm.set_value('property_name', '')
		frm.set_value('property_status', '')
		frm.set_value('transaction_status', 'Aucun')
		$(cur_frm.fields_dict.property_details.wrapper).html('');
		frm.set_value('rent_price', '')
		frm.set_value('notary_fees', '')
		frm.set_value('deposit', '')
		frm.set_value('total_rent_amount', '')
		frm.set_value('rent_duration', '')
		frm.set_value('rent_start_date',frappe.datetime.get_today() )
		frm.set_value('rent_end_date', '')
		frm.set_value('sale_price', '')
		frm.set_value('negotiable', '')
		frm.set_value('total_amount', '')
		frm.set_value('already_paid_amount', '')
		frm.set_value('outstanding_amount', '')
		frm.set_value('notes', '')
		frm.set_value('commission_from_owner', '')
		frm.set_value('is_paid_by_owner', '')
		frm.set_value('owner_payment_date', '')
		frm.set_value('commission_from_client', '')
		frm.set_value('is_paid_by_client', '')
		frm.set_value('client_payment_date', '')
		
		if (frm.doc.transaction_type == 'Visite') {
			frappe.call({
				method: "real_estate.real_estate.doctype.property_transaction.property_transaction.get_visit_price",
				callback: function (r, rt) {
					visit_price = r.message;
					frm.set_value('total_amount', visit_price);
				}
			});
		}

	},
	is_paid_by_client: function (frm) {
		if (frm.doc.is_paid_by_client == 1) {
			cur_frm.set_df_property("client_payment_date", "reqd", frm.doc.is_paid_by_client == 1);
		} else {
			cur_frm.set_df_property("client_payment_date", "reqd", 0);
		}

	},
	is_paid_by_owner: function (frm) {
		if (frm.doc.is_paid_by_owner == 1) {
			cur_frm.set_df_property("owner_payment_date", "reqd", frm.doc.is_paid_by_owner == 1);
		} else {
			cur_frm.set_df_property("owner_payment_date", "reqd", 0);
		}

	},
	rent_price: function (frm) {
		if (frm.doc.transaction_type=='Louer'){
		frm.set_value('commission_from_owner', frm.doc.rent_price)
		frm.set_value('commission_from_client', frm.doc.rent_price)
		frm.set_value('deposit', frm.doc.rent_price)
		}
	},
	sale_price: function (frm) {
		if (frm.doc.sale_price > 0 && frm.doc.transaction_type=='Vente') {
			frm.set_value('commission_from_owner', frm.doc.sale_price * 0.01)
			frm.set_value('commission_from_client', frm.doc.sale_price * 0.01)
		}
	},
	onload: function (frm) {
		if (frm.doc.property == null) {
			$(cur_frm.fields_dict.property_details.wrapper).html('');
		}
		cur_frm.add_fetch("property", "property_status", "property_status");
	},
	setup: function (frm) {
		frm.fields_dict['customer'].get_query = function (doc) {
			return {
				query: "real_estate.real_estate.doctype.property_transaction.property_transaction.get_client"
			};

		};
		frm.set_indicator_formatter('transaction_status',
			function (doc) {
				let indicator = 'dark grey';
				if (doc.transaction_status == 'Non Payé') {
					indicator = 'red';
				} else if (doc.transaction_status == 'Client non payé') {
					indicator = 'orange';
				} else if (doc.transaction_status == 'Propriétaire non payé') {
					indicator = 'yellow';
				} else if (doc.transaction_status == 'Payé') {
					indicator = 'blue';
				}else if (doc.transaction_status == 'Frais de visite reçus') {
					indicator = 'green';
				}
				return indicator;
			}
		);
	},

});