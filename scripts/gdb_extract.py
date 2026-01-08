import arcpy
import os
from logger import log, success

def run(params):
    gdb = params["sourceGdb"]
    out_folder = params["outputFolder"]

    log(f"Scanning GDB: {gdb}")
    arcpy.env.workspace = gdb

    fcs = arcpy.ListFeatureClasses()
    log(f"Found {len(fcs)} feature classes")

    for fc in fcs:
        out_fc = os.path.join(out_folder, f"{fc}.shp")
        arcpy.CopyFeatures_management(fc, out_fc)
        log(f"Exported {fc}")

    success("GDB extraction completed")
