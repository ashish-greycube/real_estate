# -*- coding: utf-8 -*-
# Copyright (c) 2018, GreyCube Technologies and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class PropertyTransaction(Document):
	def on_update_after_submit(self):
		self.update_transaction_status()

	def update_transaction_status(self):
		transaction_type = self.transaction_type
		is_paid_by_client = self.is_paid_by_client
		is_paid_by_owner = self.is_paid_by_owner
		property = self.property
		if transaction_type=='Rent' or transaction_type == 'Sale':
			if (is_paid_by_client == 0 and is_paid_by_owner == 0) :
				frappe.db.set_value('Property Transaction', self.name, "transaction_status", 'Unpaid')
			if (is_paid_by_client == 1 and is_paid_by_owner == 0) :
				frappe.db.set_value('Property Transaction', self.name, "transaction_status", 'Owner Unpaid')
			if (is_paid_by_client == 0 and is_paid_by_owner == 1) :
				frappe.db.set_value('Property Transaction', self.name, "transaction_status", 'Client Unpaid')
			if (is_paid_by_client == 1 and is_paid_by_owner == 1) :
				frappe.db.set_value('Property Transaction', self.name, "transaction_status", 'Paid')

			if (transaction_type == 'Rent') :
				frappe.db.set_value('Property', property, "property_status", 'Rented')
				frappe.db.set_value('Property Transaction', self.name, "property_status", 'Rented')
			if (transaction_type == 'Sale') :
				frappe.db.set_value('Property', property, "property_status", 'Sold')
				frappe.db.set_value('Property Transaction', self.name, "property_status", 'Sold')
		self.reload()

def get_client(doctype, txt, searchfield, start, page_len, filters):
	return frappe.db.sql("""select name from `tabCustomer` where docstatus=0 and customer_type ='Client' order by name""".format(**{
			'key': searchfield,
		}), {
			'txt': "%%%s%%" % txt,
			'_txt': txt.replace("%", ""),
			'start': start,
			'page_len': page_len
		})

@frappe.whitelist()
def get_visit_price():
	return frappe.db.get_single_value("Real Estate Settings", "visit_price")

@frappe.whitelist()
def get_property_detail(property_name):
	return frappe.db.sql("""select customer,property_name,floor,address,property_type from `tabProperty` where docstatus=0 and name =%s""" ,property_name, as_dict=1)