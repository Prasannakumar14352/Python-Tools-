import arcpy
import os

# -----------------------------
# USER INPUTS (EDIT THESE)
# -----------------------------

# Source workspace (SDE or GDB)
SourcePath = r"C:\GIS\Data\source.sde"

# Target folder where GDB will be created
TargetPath = r"C:\GIS\Output"

# Output GDB name
gdbName = "OutputData.gdb"

# -----------------------------
# SETUP
# -----------------------------

arcpy.env.overwriteOutput = True
arcpy.env.workspace = SourcePath

out_gdb = os.path.join(TargetPath, gdbName)

# -----------------------------
# CREATE FILE GDB IF NOT EXISTS
# -----------------------------

if not arcpy.Exists(out_gdb):
    arcpy.CreateFileGDB_management(TargetPath, gdbName)
    print(f"Created GDB: {out_gdb}")
else:
    print(f"GDB already exists: {out_gdb}")

# -----------------------------
# COPY FEATURE CLASSES (ROOT)
# -----------------------------

fcList = arcpy.ListFeatureClasses()

for fc in fcList:
    source_fc = os.path.join(SourcePath, fc)
    target_fc = os.path.join(out_gdb, fc)

    print(f"Copying Feature Class: {fc}")
    arcpy.CopyFeatures_management(source_fc, target_fc)

# -----------------------------
# COPY TABLES
# -----------------------------

tableList = arcpy.ListTables()

for table in tableList:
    print(f"Copying Table: {table}")
    arcpy.TableToGeodatabase_conversion(
        os.path.join(SourcePath, table),
        out_gdb
    )

# -----------------------------
# COPY FEATURE DATASETS + FCs
# -----------------------------

dsList = arcpy.ListDatasets(feature_type='feature')

for dataset in dsList:
    print(f"Processing Dataset: {dataset}")

    source_ds = os.path.join(SourcePath, dataset)
    target_ds = os.path.join(out_gdb, dataset)

    # Create dataset in target GDB
    if not arcpy.Exists(target_ds):
        arcpy.CreateFeatureDataset_management(
            out_gdb,
            dataset,
            arcpy.Describe(source_ds).spatialReference
        )

    arcpy.env.workspace = source_ds
    fcList = arcpy.ListFeatureClasses()

    for fc in fcList:
        source_fc = os.path.join(source_ds, fc)
        target_fc = os.path.join(target_ds, fc)

        print(f"  Copying FC: {dataset}\\{fc}")
        arcpy.CopyFeatures_management(source_fc, target_fc)

# Reset workspace
arcpy.env.workspace = None

print("✅ Data migration completed successfully.")
