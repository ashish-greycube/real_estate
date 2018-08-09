# -*- coding: utf-8 -*-
# Copyright (c) 2018, GreyCube Technologies and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
import facebook
from frappe.model.document import Document
from frappe.website.website_generator import WebsiteGenerator
from frappe import _
from frappe.utils import (cstr)
from frappe.utils.file_manager import save_file, get_file,get_file_path

class Property(WebsiteGenerator):
	website = frappe._dict(
		template = "templates/generators/property.html",
		condition_field = "show_in_website",
		page_title_field = "property_name",
		allow_guest_to_view=1,
		no_cache = 1
	)

	def get_fb_app_id(self):
		self.fb_app_id=frappe.db.get_single_value('FaceBook Settings', 'fb_app_id')
		self.fb_page_id=frappe.db.get_single_value('FaceBook Settings', 'facebook_page_id')

	def validate(self):
		

		if not self.route:
			self.route = cstr('Properties')+'/'+cstr(self.property_status)+'/'+frappe.scrub(self.property_name).replace('_', '-')

	def get_context(self, context):
		context.parents = [{'name': self.property_status }]

	def publish_to_facebook(self):
			# Fill in the values noted in previous steps here
		cfg = {
			"page_id"      : "313618416046043",
			# "page_id"      : "641303646232151",  # Step 1
			# "access_token" : "EAAC6Oqelg08BADK0ZAuaXv7Mn6ZBcA9emP4uSmCEQqFrlzGQjsehvTkrCXyJq2ZCvAFcee0V0osn2GGg7m8oFh31FrqdYdW2dBgafgPvFtZBWe4DYhBrQJBty6ZC1GWWu2kq8fYKjw8TD7ThAOGD8ZAzCgRDzZCdSgMOFe8uBmedB9t656GIbZBP"
			 "access_token" : "EAAHMgijYgTMBAAXYJXMQ3biYuo4txWjAKZChWRqZCKBuXFxuaArnod0oVsxjrnMxonyqqkZCjPAJ2ZB89Fuxx8aZBBNy19pxYcrPRSpP9RQuI0LSxoldg3ECl9hprffA78FoooDTRcv4i0ZCJ2GCpl8enuz5QizUGE3PztHTQzXEwOukMZA6V1T"
			}

		api = get_api(cfg)

##multi
		print"--------------------------------------------------------------"
		imgs_id = []
		# retrieve property photo
		if self.property_photo:
			photo = open(get_file_path(self.property_photo), 'rb')
			imgs_id.append(api.put_photo(photo, album_id='me/photos',published=False)['id'])
			photo.close()
		# retrieve property slide show photos
		for img in self.get("slideshow_items"):
			photo = open(get_file_path(img.image), 'rb')
			imgs_id.append(api.put_photo(photo, album_id='me/photos',published=False)['id'])
			photo.close()
		print(imgs_id)
		args=dict()

		message="Property : "+self.property_name
		# #  "		Description:"+self.property_type+"		Location : "+self.address+"		Contact :"+ self.telephone+"		Rent per month is: "+self.rent_price
	
		if imgs_id:
			args["message"]=message
			for img_id in imgs_id:
				key="attached_media["+str(imgs_id.index(img_id))+"]"
				args[key]="{'media_fbid': '"+img_id+"'}"
			print(args)
			status=api.request(path='/me/feed', args=None, post_args=args, method='POST')
		print"--------------------------------------------------------------"
		print status
		return status
##multi



		# photo_list=[]
		# imgs_id = []
		# for i in range(3):
		# 	message="Property : "+self.property_name
		# #  "		Description:"+self.property_type+"		Location : "+self.address+"		Contact :"+ self.telephone+"		Rent per month is: "+self.rent_price
		# 	photo = open(get_file_path(self.property_photo), 'rb')
		# 	status=api.put_photo(photo,published='False',message=message,caption=self.property_name,link='https://google.com')
		# 	print(status)
		# 	photo_list.append(status['id'])
		# 	print(i)
		# 	print"--------------------------------------------------------------"
		# print(photo_list)
		# return status	


def get_api(cfg):
  graph = facebook.GraphAPI(cfg['access_token'])
  # Get page token to post as the page. You can skip 
  # the following if you want to post as yourself. 
  resp = graph.get_object('me/accounts')
  page_access_token = None
  for page in resp['data']:
    if page['id'] == cfg['page_id']:
      page_access_token = page['access_token']
  graph = facebook.GraphAPI(page_access_token)
  # graph.put_photo(image=open("/home/ashish/frappe-bench-master/apps/post_to_fb/post_to_fb/www/greycubelogo1200a5c2fd.png", 'rb'),album_path='641303646232151' + "/picture")
  return graph
  # You can also skip the above if you get a page token:
  # http://stackoverflow.com/questions/8231877/facebook-access-token-for-pages
  # and make that long-lived token as in Step 3

if __name__ == "__main__":
  main()

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