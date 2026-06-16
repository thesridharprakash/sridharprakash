import fs from "fs";
import path from "path";

const logDir = path.join(process.cwd(), "logs");
const logFile = path.join(logDir, "admin.log");
const canWriteLocalLogs = !(process.env.VERCEL || process.env.NODE_ENV === "production");

function ensureLogDir() {
  if (!canWriteLocalLogs) return;
  if (!fs.existsSync(logDir)) {
    try {
      fs.mkdirSync(logDir, { recursive: true });
    } catch (error) {
      console.warn("ADMIN_LOG_DIR_CREATE_FAILED", String(error));
    }
  }
}

export function adminLog(action: string, payload?: Record<string, unknown>) {
  const entry = `${new Date().toISOString()} ${action} ${JSON.stringify(payload || {})}\n`;
  if (canWriteLocalLogs) {
    try {
      ensureLogDir();
      fs.appendFileSync(logFile, entry, "utf8");
    } catch (error) {
      // Vercel/serverless deployments may not allow writes to the project filesystem.
      console.warn("ADMIN_LOG_WRITE_FAILED", String(error));
    }
  }
  console.log("ADMIN", action, payload ?? {});
}

export function readAdminLogs(limit = 50) {
  if (!canWriteLocalLogs) {
    return [];
  }
  try {
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
  } catch (error) {
    console.warn("ADMIN_LOG_READ_FAILED", String(error));
    return [];
  }
}

export function getAdminLogFilePath() {
  ensureLogDir();
  return logFile;
}
