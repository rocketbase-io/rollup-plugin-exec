/**
 * Normalizes the commands parameter of this plugin to a string array.
 * @param commands - The parameter to normalize
 * @internal
 */
export function normalizeCommands(commands: string | string[]): string[] {
  if (typeof commands === "string") commands = [commands];
  if (!Array.isArray(commands)) throw new Error("commands should be a string or string array");
  return commands.slice();
}
