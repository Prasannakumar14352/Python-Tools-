
import { LogEntry, GISScript, AppConfig } from '../types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function simulateScriptRun(
  script: GISScript,
  config: AppConfig,
  onLog: (log: LogEntry) => void,
  onProgress: (progress: number) => void
): Promise<boolean> {
  const timestamp = () => new Date().toLocaleTimeString();
  const currentScript = config.scripts[script.id] || "No content";

  onLog({ timestamp: timestamp(), level: 'SYSTEM', message: `Initializing Architecture for: ${script.name}` });
  onLog({ timestamp: timestamp(), level: 'INFO', message: `Loading local Python Environment: ${config.interpreterPath || 'arcgispro-py3'}` });
  
  onProgress(10);
  await delay(400);

  onLog({ timestamp: timestamp(), level: 'INFO', message: `Sending Script Context to Backend...` });
  
  // Simulation of running the ACTUAL code
  onProgress(30);
  await delay(800);
  
  const scriptPreview = currentScript.substring(0, 50).replace(/\n/g, ' ') + "...";
  onLog({ timestamp: timestamp(), level: 'INFO', message: `Executing Python block: [${scriptPreview}]` });

  if (script.id === 'sde-to-gdb') {
    onLog({ timestamp: timestamp(), level: 'INFO', message: `Connecting to SDE Workspace: ${config.sdeToGdbSource}` });
    await delay(1000);
    onLog({ timestamp: timestamp(), level: 'INFO', message: `Creating Output GDB at ${config.sdeToGdbTargetFolder}` });
    onProgress(60);
    await delay(800);
    onLog({ timestamp: timestamp(), level: 'SUCCESS', message: `Schema migration successful.` });
  }

  onProgress(85);
  await delay(1200);

  if (Math.random() < 0.02) {
    onLog({ timestamp: timestamp(), level: 'ERROR', message: `RuntimeError: arcpy failed to find specified workspace.` });
    onProgress(0);
    return false;
  }

  onLog({ timestamp: timestamp(), level: 'SUCCESS', message: `✅ Script execution finished successfully.` });
  onProgress(100);
  return true;
}
