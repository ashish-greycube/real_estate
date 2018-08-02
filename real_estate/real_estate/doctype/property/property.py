# -*- coding: utf-8 -*-
# Copyright (c) 2018, GreyCube Technologies and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
from frappe.website.website_generator import WebsiteGenerator
from frappe import _
from frappe.utils import (cstr)

class Property(WebsiteGenerator):
	website = frappe._dict(
		template = "templates/generators/property.html",
		condition_field = "show_in_website",
		page_title_field = "property_name",
		allow_guest_to_view=1,
		no_cache = 1
	)

	def validate(self):
		if not self.route:
			self.route = cstr('Properties')+'/'+cstr(self.property_status)+'/'+frappe.scrub(self.property_name).replace('_', '-')

	def get_context(self, context):
		context.parents = [{'name': self.property_status }]

def get_list_context(context):
	context.title = _("Property")
	context.introduction = _('Current Open Property')

@frappe.whitelist()
def get_contact_detail(customer_name):
	return frappe.db.sql("""select first_name, IFNULL(last_name,''),email_id,IFNULL(mobile_no,phone) from tabContact 
		where name in (
				select parent from `tabDynamic Link` where link_doctype='Customer' and link_name=%s ) order by is_primary_contact desc, creation desc limit 1""",customer_name)


def get_owner(doctype, txt, searchfield, start, page_len, filters):
	return frappe.db.sql("""select name from `tabCustomer` where docstatus=0 and customer_type ='Owner' order by name""".format(**{
			'key': searchfield,
		}), {
			'txt': "%%%s%%" % txt,
			'_txt': txt.replace("%", ""),
			'start': start,
			'page_len': page_len
		})