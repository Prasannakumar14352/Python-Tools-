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
  
  // Actually try to fetch the file to prove it's editable and available
  let scriptContent = "";
  try {
    const response = await fetch(scriptPath);
    scriptContent = await response.text();
    onLog({ timestamp: timestamp(), level: 'SUCCESS', message: `Successfully loaded script file (${scriptContent.length} bytes)` });
  } catch (err) {
    onLog({ timestamp: timestamp(), level: 'WARNING', message: `Could not fetch external file. Using default internal handler.` });
    scriptContent = "print('Running simulation handler...')";
  }

  onProgress(30);
  await delay(600);
  
  // Show a preview of the actual file content in the console
  const scriptPreview = scriptContent.split('\n')[0] + " ... " + (scriptContent.split('\n').pop() || "");
  onLog({ timestamp: timestamp(), level: 'INFO', message: `Executing code: [${scriptPreview}]` });

  if (script.id === 'sde-to-gdb') {
    onLog({ timestamp: timestamp(), level: 'INFO', message: `Connecting to SDE: ${config.sdeToGdbSource}` });
    await delay(1000);
    onLog({ timestamp: timestamp(), level: 'INFO', message: `Targeting GDB: ${config.sdeToGdbTargetFolder}\\${config.sdeToGdbName}` });
    onProgress(60);
    await delay(800);
    onLog({ timestamp: timestamp(), level: 'INFO', message: `Processing feature classes from file logic...` });
  }

  onProgress(85);
  await delay(1000);

  if (Math.random() < 0.02) {
    onLog({ timestamp: timestamp(), level: 'ERROR', message: `RuntimeError: File system lock detected on target GDB.` });
    onProgress(0);
    return false;
  }

  onLog({ timestamp: timestamp(), level: 'SUCCESS', message: `✅ Task completed using logic from ${scriptPath}` });
  onProgress(100);
  return true;
}