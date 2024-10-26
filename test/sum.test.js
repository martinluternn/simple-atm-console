import { sum } from "../calculation.js";
import assert from "assert";

describe("sum", () => {
  it("should return 3 when adding 1 and 2", () => {
    const result = sum(1, 2);
    assert.strictEqual(result, 3);
  });

  it("should return 0 when adding -1 and 1", () => {
    const result = sum(-1, 1);
    assert.strictEqual(result, 0);
  });
});
