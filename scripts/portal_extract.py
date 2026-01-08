from arcgis.gis import GIS
import xlwt
import os
from logger import log, success

def run(params):
    portal = params["portalUrl"]
    user = params["portalUser"]
    password = params["portalPass"]
    output_path = params["portalOutputPath"]

    log("Authenticating with GIS Portal ...")
    gis = GIS(portal, user, password)
    log("Connection established.")

    log("Fetching portal content ...")
    items = gis.content.search(query=f"owner:{user}", max_items=5000)

    wb = xlwt.Workbook()
    ws = wb.add_sheet("Portal Inventory")

    headers = ["Title", "Type", "Owner", "Created", "Modified", "ID"]
    for col, h in enumerate(headers):
        ws.write(0, col, h)

    for i, item in enumerate(items, start=1):
        ws.write(i, 0, item.title)
        ws.write(i, 1, item.type)
        ws.write(i, 2, item.owner)
        ws.write(i, 3, item.created)
        ws.write(i, 4, item.modified)
        ws.write(i, 5, item.id)

        if i % 25 == 0:
            log(f"Processed {i} items...")

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    wb.save(output_path)

    success(f"Excel file created: {output_path}")
