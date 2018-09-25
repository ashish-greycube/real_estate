frappe.ui.form.on("Customer", {
    onload: function (frm) {
        if (frappe.get_prev_route()[1] == "Lead") {
            frm.set_value('customer_type', 'Client')
        }
    },
    onload_post_render: function (frm) {
	
        frm.clear_custom_buttons()
        frm.dashboard.hide()
    },
    refresh: function (frm) {
        frm.clear_custom_buttons()
        frm.dashboard.hide()
    },
});