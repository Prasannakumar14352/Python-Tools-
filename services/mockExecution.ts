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
  
  // Construct the CLI command for visualization in the logs
  let command = `python "${scriptPath}"`;
  
  if (scriptId === 'portal-extract') {
    command += ` "${config.portalUrl}" "${config.portalUser}" "********"`;
    onLog({ timestamp: timestamp(), level: 'INFO', message: `Target Portal: ${config.portalUrl}` });
    onLog({ timestamp: timestamp(), level: 'INFO', message: `Auth User: ${config.portalUser}` });
  } else if (scriptId === 'sde-to-gdb') {
    command += ` "${config.sdeToGdbSource}" "${config.sdeToGdbTargetFolder}" "${config.sdeToGdbName}"`;
    onLog({ timestamp: timestamp(), level: 'INFO', message: `Source SDE: ${config.sdeToGdbSource}` });
    onLog({ timestamp: timestamp(), level: 'INFO', message: `Output Folder: ${config.sdeToGdbTargetFolder}` });
    onLog({ timestamp: timestamp(), level: 'INFO', message: `GDB Name: ${config.sdeToGdbName}` });
  } else if (scriptId === 'gdb-extract') {
    command += ` "${config.sourceGdb}" "${config.outputFolder}"`;
    onLog({ timestamp: timestamp(), level: 'INFO', message: `Source GDB: ${config.sourceGdb}` });
    onLog({ timestamp: timestamp(), level: 'INFO', message: `Target Dir: ${config.outputFolder}` });
  } else if (scriptId === 'sde-to-sde') {
    command += ` "${config.sdeConnection}" "${config.targetSdeConnection}"`;
    onLog({ timestamp: timestamp(), level: 'INFO', message: `Source SDE: ${config.sdeConnection}` });
    onLog({ timestamp: timestamp(), level: 'INFO', message: `Target SDE: ${config.targetSdeConnection}` });
  } else if (scriptId === 'fc-comparison') {
    command += ` "${config.sourceDataset}" "${config.targetDataset}"`;
    onLog({ timestamp: timestamp(), level: 'INFO', message: `Dataset A: ${config.sourceDataset}` });
    onLog({ timestamp: timestamp(), level: 'INFO', message: `Dataset B: ${config.targetDataset}` });
  }

  onLog({ timestamp: timestamp(), level: 'SYSTEM', message: `CLI: ${command}` });

  onProgress(30);
  await delay(800);
  
  onLog({ timestamp: timestamp(), level: 'INFO', message: `Starting Python runtime execution ...` });

  // Custom behavior per script type
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
    onLog({ timestamp: timestamp(), level: 'INFO', message: `[*] Initializing Workspace: ${config.sdeToGdbSource}` });
    await delay(800);
    onLog({ timestamp: timestamp(), level: 'INFO', message: `[*] Creating File Geodatabase: ${config.sdeToGdbName}` });
    onProgress(40);
    await delay(1000);
    onLog({ timestamp: timestamp(), level: 'INFO', message: `[*] Scanning source SDE for Feature Classes...` });
    await delay(1200);
    onLog({ timestamp: timestamp(), level: 'INFO', message: `[*] Found 8 feature classes.` });
    onProgress(60);
    onLog({ timestamp: timestamp(), level: 'INFO', message: `[*] Migrating datasets to: ${config.sdeToGdbTargetFolder}\\${config.sdeToGdbName}` });
    await delay(2000);
    onLog({ timestamp: timestamp(), level: 'SUCCESS', message: `✅ Successfully migrated SDE data to File GDB.` });
    onProgress(90);
  } else if (scriptId === 'gdb-extract') {
    onLog({ timestamp: timestamp(), level: 'INFO', message: `[*] Opening Workspace: ${config.sourceGdb}` });
    await delay(1000);
    onLog({ timestamp: timestamp(), level: 'INFO', message: `[*] Listing Feature Classes...` });
    await delay(500);
    onLog({ timestamp: timestamp(), level: 'INFO', message: `[*] Found 5 feature classes.` });
    onProgress(50);
    onLog({ timestamp: timestamp(), level: 'INFO', message: `[*] Commencing Batch Extraction to Shapefile format...` });
    await delay(2500);
    onLog({ timestamp: timestamp(), level: 'SUCCESS', message: `✅ Extraction complete. Check directory: ${config.outputFolder}` });
  } else {
    onLog({ timestamp: timestamp(), level: 'INFO', message: `Executing Arcpy automation logic...` });
    onProgress(70);
    await delay(1500);
    onLog({ timestamp: timestamp(), level: 'SUCCESS', message: `✅ Logic executed successfully.` });
  }

  onLog({ timestamp: timestamp(), level: 'SUCCESS', message: `✅ Task completed successfully.` });
  onProgress(100);
  return true;
}