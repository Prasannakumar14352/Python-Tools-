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
    onLog({ timestamp: timestamp(), level: 'ERROR', message: `Critical Error: Script file '${scriptPath}' not found. Please ensure the file exists in the /scripts/ directory.` });
    onProgress(0);
    return false;
  }

  // Simulate token replacement (Variable Injection)
  onLog({ timestamp: timestamp(), level: 'INFO', message: `Injecting UI parameters into logic...` });
  
  // Actually inject the real password into the script content but REDACT it in logs
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
      .replace(/{Pass}/g, config.portalPass); // Use real pass for execution
    
    // Log redacted version
    onLog({ timestamp: timestamp(), level: 'INFO', message: `Target Portal: ${config.portalUrl}` });
    onLog({ timestamp: timestamp(), level: 'INFO', message: `Auth User: ${config.portalUser}` });
  }

  onProgress(30);
  await delay(600);
  
  onLog({ timestamp: timestamp(), level: 'INFO', message: `Starting Python runtime execution...` });

  // Specific simulation logs for Portal Extract
  if (script.id === 'portal-extract') {
    onLog({ timestamp: timestamp(), level: 'INFO', message: `Authenticating with GIS Module...` });
    await delay(1200);
    onLog({ timestamp: timestamp(), level: 'SUCCESS', message: `Connection established.` });
    onProgress(50);
    onLog({ timestamp: timestamp(), level: 'INFO', message: `Running: gis.content.search(query='owner:${config.portalUser}')` });
    await delay(1000);
    onLog({ timestamp: timestamp(), level: 'INFO', message: `Writing items to xlwt.Workbook...` });
    onProgress(80);
    await delay(800);
    onLog({ timestamp: timestamp(), level: 'INFO', message: `Finalizing Excel output: Portal_Inventory.xls` });
  } else {
    // Default generic progress for others
    onProgress(60);
    await delay(1000);
    onProgress(90);
  }

  onProgress(95);
  await delay(1000);

  onLog({ timestamp: timestamp(), level: 'SUCCESS', message: `✅ Task completed successfully.` });
  onProgress(100);
  return true;
}
