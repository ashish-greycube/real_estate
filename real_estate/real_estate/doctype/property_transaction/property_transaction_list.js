frappe.listview_settings['Property Transaction'] = {
	get_indicator: function(doc) {
	 {
			return [__(doc.transaction_status), {
				"Unpaid": "red",
				"Owner Unpaid": "yellow",
				"Client Unpaid": "orange",
				"Paid": "blue",
                "Visit Fee Received": "darkgrey",
                "": "white"
			}[doc.transaction_status], "Transaction Status,=," + doc.transaction_status];
		}
	}
};