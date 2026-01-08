
import { AppConfig } from './types';

export const DEFAULT_CONFIG: AppConfig = {
  interpreterPath: '',
  backendVerified: false,
  sourceGdb: 'C:\\Data\\MyDatabase.gdb',
  sdeConnection: 'C:\\Users\\User\\AppData\\Roaming\\Esri\\ArcGISPro\\DBConnections\\Connection.sde',
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
  sdeToGdbName: 'OutputData.gdb'
};

export const FEATURE_CLASSES_MOCK = [
  { name: 'Parcels', rows: '12,456', type: 'Polygon' },
  { name: 'Roads', rows: '8,234', type: 'Polyline' },
  { name: 'Buildings', rows: '15,678', type: 'Polygon' },
  { name: 'Utilities', rows: '4,521', type: 'Point' },
  { name: 'Zoning', rows: '2,345', type: 'Polygon' },
  { name: 'Hydrology', rows: '3,456', type: 'Polyline' },
];
