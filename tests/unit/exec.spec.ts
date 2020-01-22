import { exec } from "src/exec";
import { promises as fs, existsSync } from "fs";
import { Config } from "src/config";

const tmpFile = "test.temp";
const config: Config = {
  env: process.env,
  once: true,
  shell: true,
  stdio: "ignore",
  sync: false
};

describe("exec.ts", () => {
  describe("exec()", () => {
    it("should run a command", async () => {
      if (existsSync(tmpFile)) await fs.unlink(tmpFile);
      await exec(`touch ${tmpFile}`, config);
      const exists = existsSync(tmpFile);
      if (exists) await fs.unlink(tmpFile);
      expect(exists).toBeTruthy();
    });
    it("should reject on error", async () => {
      await expect(exec("test", config)).rejects.toBe(1);
    });
  });
});
