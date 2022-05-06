import { getExtension } from "../api";
import { firstWords } from "../components/UI/Pages/BusinessGuides";

test("getExtension", () => {
  expect(getExtension("")).toBe("");
  expect(getExtension(".")).toBe("");
  expect(getExtension(".b")).toBe("b");
  expect(getExtension("a.b")).toBe("b");
  expect(getExtension("a.b.")).toBe("");
  expect(getExtension("a.b.c")).toBe("c");
});

test("firstWords", () => {
  expect(firstWords("", 0)).toBe("");
  expect(firstWords("", 1)).toBe("");
  expect(firstWords(" ", 0)).toBe("");
  expect(firstWords(" ", 1)).toBe("");
  expect(firstWords("  ", 1)).toBe("");
  expect(firstWords("  ", 2)).toBe(" ");
  expect(firstWords("a b", 0)).toBe("");
  expect(firstWords("a b", 1)).toBe("a");
  expect(firstWords("a b", 2)).toBe("a b");
  expect(firstWords("a b", 3)).toBe("a b");
  expect(firstWords("a b ", 2)).toBe("a b");
});
