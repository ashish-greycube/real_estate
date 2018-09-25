frappe.ui.form.on("Lead", {
    onload_post_render: function (frm) {
        frm.dashboard.hide()
    },
    search: function (frm) {
        var filter = {}

        var arr_filter=[]

        if (frm.doc.property_type) {
            filter['property_type'] = ["=", frm.doc.property_type]
            arr_filter.push(['property_type','=',frm.doc.property_type])
        }
        if (frm.doc.city) {
            filter['city'] = ["like", frm.doc.city]
            arr_filter.push(['city','like', "%"+frm.doc.city+ "%"])
        }
        if (frm.doc.purpose) {
            filter["property_status"] = ["in", [frm.doc.purpose, "À louer et à vendre"]]
            arr_filter.push(['property_status','in',[frm.doc.purpose, "À louer et à vendre"]])
        }
        if (frm.doc.purpose) {
            if (frm.doc.purpose == 'A louer') {
                if ((frm.doc.price_from) && (frm.doc.price_to) ){
                    filter["Property.rent_price"] = [">=", frm.doc.price_from]
                    filter["rent_price"] = ["<=", frm.doc.price_to]

                arr_filter.push(['rent_price','>=',frm.doc.price_from])
                arr_filter.push(['rent_price','<=',frm.doc.price_to])
                }
                if (frm.doc.price_from && !frm.doc.price_to) {
                    filter["rent_price"] = [">=", frm.doc.price_from]
                    arr_filter.push(['rent_price','>=',frm.doc.price_from])
                }
                if (!frm.doc.price_from && frm.doc.price_to) {
                    filter["rent_price"] = ["<=", frm.doc.price_to]
                    arr_filter.push(['rent_price','<=',frm.doc.price_to])
                }

            } else if (frm.doc.purpose == 'À vendre') {
                if ((frm.doc.price_from) && (frm.doc.price_to) ) {
                    filter["Property.sale_price"] = [">=", frm.doc.price_from]
                    filter["sale_price"] = ["<=", frm.doc.price_to]

                    arr_filter.push(['sale_price','>=',frm.doc.price_from])
                    arr_filter.push(['sale_price','<=',frm.doc.price_to])
                }
                if (frm.doc.price_from && !frm.doc.price_to) {
                    filter["sale_price"] = [">=", frm.doc.price_from]

                    arr_filter.push(['sale_price','>=',frm.doc.price_from])
                }
                if (!frm.doc.price_from && frm.doc.price_to) {
                    filter["sale_price"] = ["<=", frm.doc.price_to]
                    arr_filter.push(['sale_price','<=',frm.doc.price_to])
                }
            }
        }
        if (frm.doc.baths) {
            filter['baths'] = [">=", frm.doc.baths]
            arr_filter.push(['baths','>=',frm.doc.baths])
        }
        if (frm.doc.rooms) {
            filter['rooms'] = [">=", frm.doc.rooms]
            arr_filter.push(['rooms','>=',frm.doc.rooms])
        }
        if (frm.doc.size_sq_mt) {
            filter['size_sq_mt'] = [">=", frm.doc.size_sq_mt]
            arr_filter.push(['size_sq_mt','>=',frm.doc.size_sq_mt])
        }
        if (frm.doc.year_built) {
            filter['year_built'] = [">=", frm.doc.year_built]
            arr_filter.push(['year_built','>=',frm.doc.year_built])
        }
        if (frm.doc.furnished) {
            filter['furnished'] = ["=", frm.doc.furnished]
            arr_filter.push(['furnished','=',frm.doc.furnished])

        }
        
        frappe.call({
            method: "frappe.client.get_list",
            args: {
                doctype: "Property",
                filters: arr_filter,
                fields: ["property_name"]
            },
        }).then(function (r) {
            if (r.message) {
                frappe.confirm(
                    "Results matching <b>" + r.message.length + "</b> properties"+"<br /> Would you like to go to list?",
                    function () {
                           console.log(filter)
                        frappe.route_options = filter
                        frappe.set_route("List", "Property");
                    },
                    function () {
                        window.close();
                    }
                )
            }else{
                show_alert('No property found matching this criteria', 4);
            }
        });
    }
});