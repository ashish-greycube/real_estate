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
                const property_data = r.message;
                console.log(r.message)
                console.log(property_data)
                if (property_data) {
                    const html = `
                        <table class="table table-bordered">
                            <thead><tr><th>${__("#")}</th><th>${__("Type")}</th><th>${__("Owner")}</th><th>${__("Property")}</th><th>${__("Floor")}</th><th>${__("Address")}</th><th>${__("Type")}</th></tr></thead>
                            <tbody>
                                ${property_data.map((c,i) => `<tr><td>${i+1}</td><td>${c.for_customer}</td><td>${c.property_name}</td>
                                    <td>${c.floor}</td><td>${c.address}</td><td>${c.property_type}</td></tr>`
                                ).join('')}
                            </tbody>
                        </table>`
                    $(cur_frm.fields_dict.property_data.wrapper).html(html);
                }
            }
        });
    }
});