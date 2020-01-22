import { default as main, execNext } from "src/main";
import { Config } from "src/config";
import { existsSync, promises as fs } from "fs";

const tmpFile = "test.temp";

const configSync: Config = {
  env: process.env,
  once: true,
  shell: true,
  stdio: "ignore",
  sync: true
};

const config: Config = {
  env: process.env,
  once: true,
  shell: true,
  stdio: "ignore",
  sync: false
};

describe("main.ts", () => {
  describe("default()", () => {
    it("should return a rollup plugin", () => {
      const plugin = main("echo test");
      expect(plugin).toBeTruthy();
      expect(typeof plugin.writeBundle).toBe("function");
    });
    it("should only run commands once if once is true", async () => {
      if (existsSync(tmpFile)) await fs.unlink(tmpFile);
      const { writeBundle } = main(`touch ${tmpFile}`, { once: true });
      await writeBundle();
      let exists = existsSync(tmpFile);
      expect(exists).toBeTruthy();
      if (exists) await fs.unlink(tmpFile);
      await writeBundle();
      exists = existsSync(tmpFile);
      expect(exists).toBeFalsy();
      if (exists) await fs.unlink(tmpFile);
    });
  });
  describe("execNext()", () => {
    it("should execute all commands given in async mode", async () => {
      const files = ["test1.tmp", "test2.tmp", "test3.tmp"];
      await Promise.all(files.map(async file => existsSync(file) && fs.unlink(file)));
      await execNext(
        files.map(file => `touch ${file}`),
        config
      );
      files.map(file => expect(existsSync(file)).toBeTruthy());
      await Promise.all(files.map(async file => existsSync(file) && fs.unlink(file)));
    });
    it("should stop executing on error in async mode", async () => {
      const files = ["test1.tmp", "test2.tmp"];
      await Promise.all(files.map(async file => existsSync(file) && fs.unlink(file)));
      await expect(execNext(["touch test1.tmp", "test", "touch test2.tmp"], config)).rejects.toBe(1);
      expect(existsSync("test1.tmp")).toBeTruthy();
      expect(existsSync("test2.tmp")).toBeFalsy();
      await Promise.all(files.map(async file => existsSync(file) && fs.unlink(file)));
    });
    it("should execute all commands given in sync mode", async () => {
      const files = ["test1.tmp", "test2.tmp", "test3.tmp"];
      await Promise.all(files.map(async file => existsSync(file) && fs.unlink(file)));
      await execNext(
        files.map(file => `touch ${file}`),
        configSync
      );
      files.map(file => expect(existsSync(file)).toBeTruthy());
      await Promise.all(files.map(async file => existsSync(file) && fs.unlink(file)));
    });
    it("should stop executing on error in sync mode", async () => {
      const files = ["test1.tmp", "test2.tmp"];
      await Promise.all(files.map(async file => existsSync(file) && fs.unlink(file)));
      expect(execNext(["touch test1.tmp", "test", "touch test2.tmp"], configSync)).toBeFalsy();
      expect(existsSync("test1.tmp")).toBeTruthy();
      expect(existsSync("test2.tmp")).toBeFalsy();
      await Promise.all(files.map(async file => existsSync(file) && fs.unlink(file)));
    });
  });
});
