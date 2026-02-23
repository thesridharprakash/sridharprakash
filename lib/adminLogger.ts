import fs from "fs";
import path from "path";

const logDir = path.join(process.cwd(), "logs");
const logFile = path.join(logDir, "admin.log");

function ensureLogDir() {
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
}

export function adminLog(action: string, payload?: Record<string, unknown>) {
  ensureLogDir();
  const entry = `${new Date().toISOString()} ${action} ${JSON.stringify(payload || {})}\n`;
  fs.appendFileSync(logFile, entry, "utf8");
  console.log("ADMIN", action, payload ?? {});
}

export function readAdminLogs(limit = 50) {
  if (!fs.existsSync(logFile)) {
    return [];
  }

  const content = fs.readFileSync(logFile, "utf8");
  return content
    .split("\n")
    .filter((line) => line.trim())
    .slice(-limit)
    .map((line) => {
      const [timestamp, action, payloadRaw] = line.split(" ", 3);
      return {
        timestamp,
        action,
        payload: payloadRaw ? JSON.parse(payloadRaw) : {},
        raw: line,
      };
    });
}

export function getAdminLogFilePath() {
  ensureLogDir();
  return logFile;
}
