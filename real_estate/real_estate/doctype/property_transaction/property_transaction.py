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
