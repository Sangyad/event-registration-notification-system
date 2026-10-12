/** Returns a required environment variable or throws a configuration error. */
export function getRequiredEnvVar(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

/** Returns an optional integer environment variable with a fallback. */
export function getOptionalInteger(name: string, fallback: number): number {
  const value = process.env[name]?.trim();
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}
