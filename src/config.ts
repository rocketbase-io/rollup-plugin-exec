/**
 * The parameters for this plugin
 * @public
 */
export interface Config {
  sync: boolean;
  once: boolean;
  shell: boolean;
  stdio: "inherit" | "ignore" | "pipe";
  env: Record<string, string | undefined>;
}
