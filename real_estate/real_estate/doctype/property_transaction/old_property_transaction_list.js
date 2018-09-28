frappe.listview_settings['Property Transaction'] = {
	get_indicator: function(doc) {
	 {
			return [__(doc.transaction_status), {
				"Non Payé": "red",
				"Propriétaire non payé": "yellow",
				"Client non payé": "orange",
				"Payé": "blue",
                "Frais de visite reçus": "darkgrey",
                "": "white"
			}[doc.transaction_status], "Transaction Status,=," + doc.transaction_status];
		}
	},
	refresh: function(listview) {
		listview.page.clear_menu()
	},
	onload: function(listview) {

		// this.wrapper.find("a.remove-filter").on("click", function() {
		// 	me.remove();
		// });

		listview.page.clear_menu()
		frappe.route_options = {'transaction_type':["like",'%%']}
		frappe.set_route("List", "Property Transaction");
}
};
