frappe.listview_settings['Property'] = {
	onload: function(listview) {

	},
	refresh: function(listview) {
		listview.page.clear_menu()
		listview.page.add_menu_item(__("Clear Filter"), function() {
			frappe.route_options = {'property_name':["like",'%%']}
            frappe.set_route("List", "Property");
			cur_list.refresh();
		});

	}
};
