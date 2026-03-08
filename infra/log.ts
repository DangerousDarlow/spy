const RED = "\x1b[31m";
const BLUE = "\x1b[34m";
const GREEN = "\x1b[32m";
const RESET = "\x1b[0m";

export function logInfo(message: unknown): void {
  console.log(`${BLUE}INFO: ${String(message)}${RESET}`);
}

export function logError(message: unknown): void {
  console.error(`${RED}ERROR: ${String(message)}${RESET}`);
}

export function logSuccess(message: unknown): void {
  console.log(`${GREEN}SUCCESS: ${String(message)}${RESET}`);
}
