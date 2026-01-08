
export enum ExecutionStatus {
  IDLE = 'IDLE',
  RUNNING = 'RUNNING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  PENDING = 'PENDING',
  SKIPPED = 'SKIPPED'
}

export interface LogEntry {
  timestamp: string;
  level: 'INFO' | 'ERROR' | 'SUCCESS' | 'WARNING' | 'SYSTEM';
  message: string;
}

export interface GISScript {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: ExecutionStatus;
  progress?: number;
  scriptPath?: string;
  error?: string;
}

export interface AppConfig {
  interpreterPath: string;
  backendVerified: boolean;
  sourceGdb: string;
  sdeConnection: string;
  targetSdeConnection: string;
  sourceDataset: string;
  targetDataset: string;
  outputFolder: string;
  portalUrl: string;
  portalUser: string;
  portalPass: string;
  comparisonType: 'schema' | 'attribute' | 'spatial';
  verboseLogging: boolean;
  dryRun: boolean;
  theme: 'light' | 'dark';
  // New SDE to GDB Fields
  sdeToGdbSource: string;
  sdeToGdbTargetFolder: string;
  sdeToGdbName: string;
}
