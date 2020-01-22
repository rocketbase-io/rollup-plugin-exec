import { Config } from "src/config";
import { spawnSync } from "child_process";

/**
 * Spawns a child process with provided options
 * @param command - The command to execute
 * @param shell - If the command should be executed in its own shell
 * @param stdio - What do do with stdio, inherit, pipe or ignore
 * @param env - What environment variables to pass
 * @returns true, if the command has run successfully
 * @internal
 */
export function execSync(command: string, { shell, stdio, env }: Config) {
  return spawnSync(command, { shell, stdio, env }).status === 0;
}
