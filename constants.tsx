
import { AppConfig } from './types';

export const DEFAULT_CONFIG: AppConfig = {
  interpreterPath: '',
  backendVerified: false,
  sourceGdb: 'C:\\Data\\MyDatabase.gdb',
  sdeConnection: 'server:5151/database@user',
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
  theme: 'light'
};

export const FEATURE_CLASSES_MOCK = [
  { name: 'Parcels', rows: '12,456' },
  { name: 'Roads', rows: '8,234' },
  { name: 'Buildings', rows: '15,678' },
  { name: 'Utilities', rows: '4,521' },
  { name: 'Zoning', rows: '2,345' },
  { name: 'Hydrology', rows: '3,456' },
];
