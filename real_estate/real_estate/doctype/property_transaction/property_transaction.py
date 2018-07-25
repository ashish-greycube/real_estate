# -*- coding: utf-8 -*-
# Copyright (c) 2018, GreyCube Technologies and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class PropertyTransaction(Document):
	pass

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