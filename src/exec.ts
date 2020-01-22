import { Config } from "src/config";
import { spawn } from "child_process";

/**
 * Spawns a child process with provided options
 * @param command - The command to execute
 * @param shell - If the command should be executed in its own shell
 * @param stdio - What do do with stdio, inherit, pipe or ignore
 * @param env - What environment variables to pass
 * @returns A promise resolving if the command was run successfully
 * @internal
 */
export function exec(command: string, { shell, stdio, env }: Config) {
  return new Promise((resolve, reject) => {
    spawn(command, { shell, stdio, env }).on("close", code => {
      if (code === 0) resolve();
      else reject(code);
    });
  });
}
