import { LogEntry, GISScript, AppConfig } from '../types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function simulateScriptRun(
  script: GISScript,
  config: AppConfig,
  onLog: (log: LogEntry) => void,
  onProgress: (progress: number) => void
): Promise<boolean> {
  const timestamp = () => new Date().toLocaleTimeString();
  const scriptPath = config.scriptFilePaths[script.id];

  onLog({ timestamp: timestamp(), level: 'SYSTEM', message: `Initializing Architecture for: ${script.name}` });
  onLog({ timestamp: timestamp(), level: 'INFO', message: `Loading local Python Environment: ${config.interpreterPath || 'arcgispro-py3'}` });
  
  onProgress(10);
  await delay(400);

  onLog({ timestamp: timestamp(), level: 'INFO', message: `Locating external logic file: ${scriptPath}` });
  
  let scriptContent = "";
  try {
    const response = await fetch(scriptPath);
    if (!response.ok) throw new Error("File not found");
    scriptContent = await response.text();
    onLog({ timestamp: timestamp(), level: 'SUCCESS', message: `Successfully loaded script file (${scriptContent.length} bytes)` });
  } catch (err) {
    onLog({ timestamp: timestamp(), level: 'ERROR', message: `Critical Error: Script file '${scriptPath}' not found in project directory.` });
    onProgress(0);
    return false;
  }

  // Simulate token replacement (Variable Injection)
  onLog({ timestamp: timestamp(), level: 'INFO', message: `Injecting UI parameters into logic...` });
  
  let processedContent = scriptContent;
  if (script.id === 'sde-to-gdb') {
    processedContent = processedContent
      .replace(/{SourcePath}/g, config.sdeToGdbSource)
      .replace(/{TargetPath}/g, config.sdeToGdbTargetFolder)
      .replace(/{GdbName}/g, config.sdeToGdbName);
  } else if (script.id === 'gdb-extract') {
    processedContent = processedContent
      .replace(/{SourcePath}/g, config.sourceGdb)
      .replace(/{TargetPath}/g, config.outputFolder);
  } else if (script.id === 'sde-to-sde') {
    processedContent = processedContent
      .replace(/{SourceSDE}/g, config.sdeConnection)
      .replace(/{TargetSDE}/g, config.targetSdeConnection);
  } else if (script.id === 'portal-extract') {
    processedContent = processedContent
      .replace(/{PortalUrl}/g, config.portalUrl)
      .replace(/{User}/g, config.portalUser)
      .replace(/{Pass}/g, '********'); // Don't log password
  }

  onProgress(30);
  await delay(600);
  
  onLog({ timestamp: timestamp(), level: 'INFO', message: `Starting ArcPy execution...` });

  // Specific simulation logs for SDE to GDB tool
  if (script.id === 'sde-to-gdb') {
    onLog({ timestamp: timestamp(), level: 'INFO', message: `Workspace set to: ${config.sdeToGdbSource}` });
    await delay(800);
    onLog({ timestamp: timestamp(), level: 'INFO', message: `Check: arcpy.Exists("${config.sdeToGdbTargetFolder}\\${config.sdeToGdbName}")` });
    onProgress(50);
    await delay(500);
    onLog({ timestamp: timestamp(), level: 'INFO', message: `Copying Root Feature Classes...` });
    await delay(800);
    onLog({ timestamp: timestamp(), level: 'INFO', message: `Processing Feature Datasets...` });
    onProgress(80);
  }

  onProgress(90);
  await delay(1000);

  onLog({ timestamp: timestamp(), level: 'SUCCESS', message: `✅ Task completed using logic from ${scriptPath}` });
  onProgress(100);
  return true;
}