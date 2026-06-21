import { describe, expect, it } from "bun:test";
import { cn } from "./utils";

describe("cn", () => {
  it("merges class names and resolves tailwind conflicts", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  it("handles conditional classes", () => {
    const active = true;
    expect(cn("base", active && "active")).toBe("base active");
  });

  it("filters out falsy values", () => {
    const inactive = false;
    expect(cn("base", inactive && "hidden", null, undefined, "")).toBe("base");
  });

});
