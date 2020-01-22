import { normalizeCommands } from "src/normalize-commands";

describe("normalize-commands.ts", () => {
  describe("normalizeCommands()", () => {
    it("should return an array as is", () => {
      const commands = ["echo hello world", "echo foo bar"];
      expect(normalizeCommands(commands)).toEqual(commands);
    });
    it("should wrap single commands as arrays", () => {
      const commands = "echo hello world";
      expect(normalizeCommands(commands)).toEqual([commands]);
    });
    it("should throw for invalid parameters", () => {
      const commands = undefined as any;
      expect(() => normalizeCommands(commands)).toThrow();
    });
  });
});
