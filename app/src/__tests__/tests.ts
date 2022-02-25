import { getExtension } from "../api";

test("getExtension", () => {
  expect(getExtension("")).toBe("");
  expect(getExtension(".")).toBe("");
  expect(getExtension(".b")).toBe("b");
  expect(getExtension("a.b")).toBe("b");
  expect(getExtension("a.b.")).toBe("");
  expect(getExtension("a.b.c")).toBe("c");
});
