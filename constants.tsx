
import { AppConfig } from './types';

export const DEFAULT_SCRIPTS: Record<string, string> = {
  'sde-to-gdb': `import arcpy
import os

# Source workspace (SDE or GDB)
SourcePath = r"{SourcePath}"

# Target folder where GDB will be created
TargetPath = r"{TargetPath}"

# Output GDB name
gdbName = "{GdbName}"

arcpy.env.overwriteOutput = True
arcpy.env.workspace = SourcePath

out_gdb = os.path.join(TargetPath, gdbName)

if not arcpy.Exists(out_gdb):
    arcpy.CreateFileGDB_management(TargetPath, gdbName)
    print(f"Created GDB: {out_gdb}")
else:
    print(f"GDB already exists: {out_gdb}")

# Copy Feature Classes
fcList = arcpy.ListFeatureClasses()
for fc in fcList:
    source_fc = os.path.join(SourcePath, fc)
    target_fc = os.path.join(out_gdb, fc)
    print(f"Copying Feature Class: {fc}")
    arcpy.CopyFeatures_management(source_fc, target_fc)

# Copy Tables
tableList = arcpy.ListTables()
for table in tableList:
    print(f"Copying Table: {table}")
    arcpy.TableToGeodatabase_conversion(os.path.join(SourcePath, table), out_gdb)

# Copy Feature Datasets
dsList = arcpy.ListDatasets(feature_type='feature')
for dataset in dsList:
    print(f"Processing Dataset: {dataset}")
    source_ds = os.path.join(SourcePath, dataset)
    target_ds = os.path.join(out_gdb, dataset)
    if not arcpy.Exists(target_ds):
        arcpy.CreateFeatureDataset_management(out_gdb, dataset, arcpy.Describe(source_ds).spatialReference)
    arcpy.env.workspace = source_ds
    fcList = arcpy.ListFeatureClasses()
    for fc in fcList:
        arcpy.CopyFeatures_management(os.path.join(source_ds, fc), os.path.join(target_ds, fc))

print("✅ Data migration completed successfully.")`,
  'gdb-extract': `# Extract GDB to Shapefiles\nimport arcpy\nimport os\n\nworkspace = r"{SourcePath}"\noutput = r"{TargetPath}"\n\narcpy.env.workspace = workspace\nfcs = arcpy.ListFeatureClasses()\nfor fc in fcs:\n    arcpy.FeatureClassToShapefile_conversion(fc, output)\nprint("Extraction complete.")`,
  'sde-to-sde': `# SDE to SDE Migration\nimport arcpy\n# Migration logic here...`,
  'fc-comparison': `# Dataset comparison logic\nimport arcpy\n# Comparison logic here...`,
  'portal-extract': `# ArcGIS Portal Content Catalog\nfrom arcgis.gis import GIS\n# Portal logic here...`
};

export const DEFAULT_CONFIG: AppConfig = {
  interpreterPath: '',
  backendVerified: false,
  sourceGdb: 'C:\\Data\\MyDatabase.gdb',
  sdeConnection: 'C:\\Connections\\Prod.sde',
  targetSdeConnection: 'server:5151/database@user',
  sourceDataset: 'C:\\Data\\Source.gdb\\FeatureClass',
  targetDataset: 'C:\\Data\\Target.gdb\\FeatureClass',
  outputFolder: 'C:\\output\\Shapefiles',
  portalUrl: 'https://www.arcgis.com',
  portalUser: '',
  portalPass: '',
  comparisonType: 'schema',
  verboseLogging: true,
  dryRun: false,
  theme: 'light',
  sdeToGdbSource: 'C:\\GIS\\Data\\source.sde',
  sdeToGdbTargetFolder: 'C:\\GIS\\Output',
  sdeToGdbName: 'OutputData.gdb',
  scripts: DEFAULT_SCRIPTS
};

export const FEATURE_CLASSES_MOCK = [
  { name: 'Parcels', rows: '12,456', type: 'Polygon' },
  { name: 'Roads', rows: '8,234', type: 'Polyline' },
  { name: 'Buildings', rows: '15,678', type: 'Polygon' },
  { name: 'Utilities', rows: '4,521', type: 'Point' },
  { name: 'Zoning', rows: '2,345', type: 'Polygon' },
  { name: 'Hydrology', rows: '3,456', type: 'Polyline' },
];
