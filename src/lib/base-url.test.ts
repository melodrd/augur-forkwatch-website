import { describe, expect, it } from "vitest";
import { joinBasePath } from "./base-url";

describe("joinBasePath", () => {
  it("joins root-relative data paths", () => {
    expect(joinBasePath("/", "data/migration-progress.json")).toBe(
      "/data/migration-progress.json",
    );
  });

  it("joins GitHub Pages project base paths", () => {
    expect(
      joinBasePath(
        "/augur-forkwatch-website/",
        "/data/migration-progress.json",
      ),
    ).toBe("/augur-forkwatch-website/data/migration-progress.json");
  });
});
