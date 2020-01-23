/* eslint-disable */
/**
 * RollupPluginExec (@rocketbase/rollup-plugin-exec v0.0.0-development)
 * Run commands after building
 * https://github.com/rocketbase-io/rollup-plugin-exec#readme
 * (c) 2020 Rocketbase Team <team@rocketbase.io>
 * @license MIT
 */
import { spawn, spawnSync } from 'child_process';

/**
 * Normalizes the commands parameter of this plugin to a string array.
 * @param commands - The parameter to normalize
 * @internal
 */
function normalizeCommands(commands) {
  if (typeof commands === "string")
    commands = [commands];
  if (!Array.isArray(commands))
    throw new Error("commands should be a string or string array");
  return commands.slice();
}

/**
 * Spawns a child process with provided options
 * @param command - The command to execute
 * @param shell - If the command should be executed in its own shell
 * @param stdio - What do do with stdio, inherit, pipe or ignore
 * @param env - What environment variables to pass
 * @returns A promise resolving if the command was run successfully
 * @internal
 */
function exec(command, { shell, stdio, env }) {
  return new Promise((resolve, reject) => {
    spawn(command, { shell, stdio, env }).on("close", code => {
      if (code === 0)
        resolve();
      else
        reject(code);
    });
  });
}

/**
 * Spawns a child process with provided options
 * @param command - The command to execute
 * @param shell - If the command should be executed in its own shell
 * @param stdio - What do do with stdio, inherit, pipe or ignore
 * @param env - What environment variables to pass
 * @returns true, if the command has run successfully
 * @internal
 */
function execSync(command, { shell, stdio, env }) {
  return spawnSync(command, { shell, stdio, env }).status === 0;
}

/**
 * A function executing commands one after the other recursively
 * @param commands - The commands to execute
 * @param config - The plugin configuration
 * @internal
 */
function execNext(commands, config) {
  const { sync } = config;
  const command = commands.shift();
  if (!command)
    return;
  if (sync) {
    if (execSync(command, config))
      return execNext(commands, config);
  }
  else {
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
function main (commands, { sync = false, once = true, shell = true, stdio = "inherit", env = process.env || {} } = {}) {
  let ranBefore = false;
  return {
    writeBundle() {
      if (once && ranBefore)
        return;
      ranBefore = true;
      return execNext(normalizeCommands(commands), { sync, once, shell, stdio, env });
    }
  };
}

export default main;
export { execNext };
