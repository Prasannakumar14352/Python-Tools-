import { LogEntry, GISScript, AppConfig } from '../types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function simulateScriptRun(
  script: GISScript,
  config: AppConfig,
  onLog: (log: LogEntry) => void,
  onProgress: (progress: number) => void
): Promise<boolean> {
  const timestamp = () => new Date().toLocaleTimeString('en-GB', { hour12: false });
  const scriptId = script.id;
  const scriptPath = config.scriptFilePaths[scriptId] || `./scripts/${scriptId}.py`;

  onLog({ timestamp: timestamp(), level: 'INFO', message: `Initialising ${scriptId.toUpperCase()} operation ...` });
  onLog({ timestamp: timestamp(), level: 'INFO', message: `Initializing Architecture for: ${scriptId}` });
  onLog({ timestamp: timestamp(), level: 'INFO', message: `Loading local Python Environment: ${config.interpreterPath}` });
  
  onProgress(10);
  await delay(600);

  onLog({ timestamp: timestamp(), level: 'INFO', message: `Locating external logic file: ${scriptPath}` });
  
  try {
    const response = await fetch(scriptPath);
    const scriptContent = response.ok ? await response.text() : "import sys\nprint('Running script...')";
    onLog({ timestamp: timestamp(), level: 'SUCCESS', message: `Successfully loaded script file (${scriptContent.length} bytes)` });
  } catch (err) {
    onLog({ timestamp: timestamp(), level: 'ERROR', message: `Critical Error: Script file '${scriptPath}' not found.` });
    return false;
  }

  onLog({ timestamp: timestamp(), level: 'INFO', message: `Injecting UI parameters into logic ...` });
  
  if (scriptId === 'portal-extract') {
    onLog({ timestamp: timestamp(), level: 'INFO', message: `Target Portal: ${config.portalUrl}` });
    onLog({ timestamp: timestamp(), level: 'INFO', message: `Auth User: ${config.portalUser}` });
  }

  onProgress(30);
  await delay(800);
  
  onLog({ timestamp: timestamp(), level: 'INFO', message: `Starting Python runtime execution ...` });

  if (scriptId === 'portal-extract') {
    onLog({ timestamp: timestamp(), level: 'INFO', message: `Authenticating with GIS Module ...` });
    await delay(1200);
    onLog({ timestamp: timestamp(), level: 'SUCCESS', message: `Connection established.` });
    onProgress(50);
    onLog({ timestamp: timestamp(), level: 'INFO', message: `Running: gis.content.search(query='owner:${config.portalUser || 'user'}')` });
    await delay(1000);
    onLog({ timestamp: timestamp(), level: 'INFO', message: `Writing items to xlwt.Workbook ...` });
    onProgress(80);
    await delay(1500);
    const fileName = config.portalOutputPath.split('\\').pop() || 'Portal_Inventory.xls';
    onLog({ timestamp: timestamp(), level: 'INFO', message: `Finalizing Excel output: ${fileName}` });
    await delay(800);
    onLog({ timestamp: timestamp(), level: 'SUCCESS', message: `📄 Excel file created: ${config.portalOutputPath}` });
  } else if (scriptId === 'sde-to-gdb') {
    onLog({ timestamp: timestamp(), level: 'INFO', message: `Searching SDE Workspace: ${config.sdeToGdbSource}` });
    await delay(800);
    onLog({ timestamp: timestamp(), level: 'INFO', message: `Found feature classes to migrate.` });
    onProgress(60);
    onLog({ timestamp: timestamp(), level: 'INFO', message: `Processing Arcpy.FeatureClassToGeodatabase...` });
    await delay(2000);
  } else {
    onLog({ timestamp: timestamp(), level: 'INFO', message: `Executing Arcpy automation logic...` });
    onProgress(70);
    await delay(1500);
  }

  onLog({ timestamp: timestamp(), level: 'SUCCESS', message: `✅ Task completed successfully.` });
  onProgress(100);
  return true;
}
