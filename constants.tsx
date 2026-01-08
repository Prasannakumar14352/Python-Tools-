
import { AppConfig } from './types';

export const SCRIPT_FILE_PATHS: Record<string, string> = {
  'sde-to-gdb': './scripts/sde_to_gdb.py',
  'gdb-extract': './scripts/gdb_extract.py',
  'sde-to-sde': './scripts/sde_to_sde.py',
  'fc-comparison': './scripts/fc_comparison.py',
  'portal-extract': './scripts/portal_extract.py'
};

export const DEFAULT_CONFIG: AppConfig = {
  interpreterPath: 'C:\\Program Files\\ArcGIS\\Pro\\bin\\Python\\envs\\arcgispro-py3\\python.exe',
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
  portalOutputPath: 'C:\\GIS\\Reports\\Portal_Inventory.xls',
  comparisonType: 'schema',
  verboseLogging: true,
  dryRun: false,
  theme: 'light',
  sdeToGdbSource: 'C:\\GIS\\Data\\source.sde',
  sdeToGdbTargetFolder: 'C:\\GIS\\Output',
  sdeToGdbName: 'OutputData.gdb',
  scriptFilePaths: SCRIPT_FILE_PATHS
};

export const FEATURE_CLASSES_MOCK = [
  { name: 'Parcels', rows: '12,456', type: 'Polygon' },
  { name: 'Roads', rows: '8,234', type: 'Polyline' },
  { name: 'Buildings', rows: '15,678', type: 'Polygon' },
  { name: 'Utilities', rows: '4,521', type: 'Point' },
  { name: 'Zoning', rows: '2,345', type: 'Polygon' },
  { name: 'Hydrology', rows: '3,456', type: 'Polyline' },
];
