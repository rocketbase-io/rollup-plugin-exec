import { Config } from "src/config";
import { normalizeCommands } from "src/normalize-commands";
import { exec } from "src/exec";
import { execSync } from "src/exec-sync";

/**
 * A function executing commands one after the other recursively
 * @param commands - The commands to execute
 * @param config - The plugin configuration
 * @internal
 */
export function execNext(commands: string[], config: Config): void | Promise<void> {
  const { sync } = config;
  const command = commands.shift();
  if (!command) return;
  if (sync) {
    if (execSync(command, config)) return execNext(commands, config);
  } else {
    return exec(command, config).then(() => execNext(commands, config));
  }
}

/**
 * Rollup Plugin for executing commands after builds
 * @param commands - A command or multiple commands to execute
 * @param sync - Whether or not commands should be executed synchronously
 * @param once - If the commands should only be executed once, regardless how many build targets exist
 * @param shell - Whether the processes should spawn in their own shell
 * @param stdio - What to do with stdio of the processes (ignore, inherit, pipe)
 * @param env - The environment variables to start the process with
 * @public
 */
export default function(
  commands: string | string[],
  { sync = false, once = true, shell = true, stdio = "inherit", env = process.env || {} }: Partial<Config> = {}
) {
  let ranBefore = false;
  return {
    writeBundle() {
      if (once && ranBefore) return;
      ranBefore = true;
      return execNext(normalizeCommands(commands), { sync, once, shell, stdio, env });
    }
  };
};
