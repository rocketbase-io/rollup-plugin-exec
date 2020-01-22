import { execSync } from "src/exec-sync";
import { promises as fs, existsSync } from "fs";
import { Config } from "src/config";

const tmpFile = "test.temp";
const config: Config = {
  env: process.env,
  once: true,
  shell: true,
  stdio: "ignore",
  sync: true
};

describe("exec-sync.ts", () => {
  describe("execSync()", () => {
    it("should run a command and return true", async () => {
      if (existsSync(tmpFile)) await fs.unlink(tmpFile);
      const result = execSync(`touch ${tmpFile}`, config);
      const exists = existsSync(tmpFile);
      if (exists) await fs.unlink(tmpFile);
      expect(exists).toBeTruthy();
      expect(result).toBeTruthy();
    });
    it("should return false on error", async () => {
      await expect(execSync("test", config)).toBeFalsy();
    });
  });
});
