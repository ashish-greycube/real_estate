# -*- coding: utf-8 -*-
# Copyright (c) 2018, GreyCube Technologies and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class Property(Document):
	pass

@frappe.whitelist()
def get_contact_detail(customer_name):
	return frappe.db.sql("""select email_id,phone from tabContact 
		where first_name= (
				select link_name from `tabDynamic Link` where link_doctype='Customer' and link_name=%s limit 1
			)""",customer_name)


def get_owner(doctype, txt, searchfield, start, page_len, filters):
	return frappe.db.sql("""select name from `tabCustomer` where docstatus=0 and customer_type ='Owner' order by name""".format(**{
			'key': searchfield,
		}), {
			'txt': "%%%s%%" % txt,
			'_txt': txt.replace("%", ""),
			'start': start,
			'page_len': page_len
		})