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

});


frappe.ui.form.on('Property Transaction', {
    property: function (doc, dt, dn) {

        frappe.call({
            method: "real_estate.real_estate.doctype.property_transaction.property_transaction.get_property_detail",
            args: {
                property_name: cur_frm.doc.property
            },
            callback: function (r) {
                if (!r.message) {
                    const html = `There is no property detail for `+cur_frm.doc.property
                    $(cur_frm.fields_dict.property_details.wrapper).html(html);
                }
                const property_data = r.message[0];
                console.log(r.message)
                console.log(property_data)
                if (property_data) {
                    const html = `
                        <table class="table table-bordered">
                            <tbody>
							   <tr><td>${__("Owner: ")}${property_data.for_customer}</td></tr>
							   <tr><td>${__("Property: ")}${property_data.property_name}</td></tr>
							   <tr><td>${__("Floor: ")}${property_data.floor}</td></tr>
							   <tr><td>${__("Address: ")}${property_data.address}</td></tr>
							   <tr><td>${__("Type: ")}${property_data.property_type}</td></tr>
                            </tbody>
                        </table>`
                    $(cur_frm.fields_dict.property_details.wrapper).html(html);
                }
            }
        });
    }
});