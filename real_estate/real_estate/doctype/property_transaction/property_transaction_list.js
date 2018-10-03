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
		cur_list.wrapper.find("a.remove-filter").click()
		if (frappe.get_route_str()=="List/Property Transaction/Calendar/Default") {
			console.log('1inside')
			cur_list.wrapper.find("a.remove-filter").click()
	}

}
};
