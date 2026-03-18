import { describe, it, expect } from "vitest";
import { Climasim } from "../src/core.js";
describe("Climasim", () => {
  it("init", () => { expect(new Climasim().getStats().ops).toBe(0); });
  it("op", async () => { const c = new Climasim(); await c.process(); expect(c.getStats().ops).toBe(1); });
  it("reset", async () => { const c = new Climasim(); await c.process(); c.reset(); expect(c.getStats().ops).toBe(0); });
});
