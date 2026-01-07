
import { LogEntry, GISScript, AppConfig } from '../types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function simulateScriptRun(
  script: GISScript,
  config: AppConfig,
  onLog: (log: LogEntry) => void,
  onProgress: (progress: number) => void
): Promise<boolean> {
  const timestamp = () => new Date().toLocaleTimeString();

  onLog({ timestamp: timestamp(), level: 'SYSTEM', message: `Preparing: ${script.name}` });
  onLog({ timestamp: timestamp(), level: 'INFO', message: `Starting: ${script.scriptPath || 'Internal Module'}` });
  
  onProgress(10);
  await delay(400);

  if (config.dryRun) {
    onProgress(50);
    await delay(300);
    onLog({ timestamp: timestamp(), level: 'WARNING', message: `TEST RUN: Command would be: "${config.interpreterPath}" "${script.scriptPath || script.id}.py"` });
    onProgress(100);
    return true;
  }

  // Validation
  onProgress(25);
  await delay(600);
  onLog({ timestamp: timestamp(), level: 'INFO', message: `Checking file accessibility...` });
  
  if (!config.sourceGdb && script.id !== 'sde-to-gdb') {
    onLog({ timestamp: timestamp(), level: 'ERROR', message: `Error: Source Geodatabase path is empty.` });
    onProgress(0);
    return false;
  }

  // Processing
  onProgress(45);
  await delay(800);
  onLog({ timestamp: timestamp(), level: 'INFO', message: `Reading spatial data...` });
  
  onProgress(70);
  await delay(1000);
  onLog({ timestamp: timestamp(), level: 'INFO', message: `Applying transformations...` });
  
  if (config.verboseLogging) {
    onLog({ timestamp: timestamp(), level: 'INFO', message: `[Detail] Processing layer: "Main_Infrastructure"` });
    onLog({ timestamp: timestamp(), level: 'INFO', message: `[Detail] Memory Usage: 320 MB` });
  }

  // Completion
  onProgress(90);
  await delay(700);
  
  if (Math.random() < 0.05) {
    onLog({ timestamp: timestamp(), level: 'ERROR', message: `Fatal: Unexpected error during file write operation.` });
    onProgress(0);
    return false;
  }

  onLog({ timestamp: timestamp(), level: 'SUCCESS', message: `Done: ${script.name} completed successfully.` });
  onProgress(100);
  return true;
}
