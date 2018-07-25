// Copyright (c) 2018, GreyCube Technologies and contributors
// For license information, please see license.txt

cur_frm.fields_dict['property'].get_query = function(doc,cdt,cdn) {
	console.log(doc.transaction_type)
	transaction_type=doc.transaction_type
	if (transaction_type == 'Rent') {
		return{
			filters:{
				property_status: ["in", ["For Rent", "For Rent And Sale"]],
				'docstatus': 0
			}
	}}
	else if (transaction_type == 'Sale') {
		return{
			filters:{
				property_status: ["in", ["For Sale", "For Rent And Sale"]],
				'docstatus': 0
			}
	}
	}
	else if (transaction_type == 'Visit') {		
			return{
			filters:{
				'docstatus': 0
			}
	}
	}

	};


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
	transaction_type: function (frm) {
		frm.set_value('property','')
		$(cur_frm.fields_dict.property_details.wrapper).html('');
		frm.set_value('sale_price','')
		frm.set_value('actual_sale_price','')
		frm.set_value('rent_price','')
		frm.set_value('total_amount','')
		frm.set_value('rent_duration','')
		frm.set_value('rent_start_date','')
		frm.set_value('rent_end_date','')
		if(frm.doc.transaction_type=='Visit'){
		frappe.call({
			method: "real_estate.real_estate.doctype.property_transaction.property_transaction.get_visit_price",
			callback: function(r, rt) {	
				visit_price=r.message;
				frm.set_value('total_amount', visit_price);
			}
		});
	}
	

	},
	onload:function(frm){
		if (frm.doc.property==null){
		$(cur_frm.fields_dict.property_details.wrapper).html('');}

	},
	setup: function (frm) {
		frm.fields_dict['client'].get_query = function (doc) {
			return {
				query: "real_estate.real_estate.doctype.property_transaction.property_transaction.get_client"
			};

		};
	}
});