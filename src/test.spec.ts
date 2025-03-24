import { describe, it } from "bun:test";
import { parseBalance } from "./hooks/usePortfolio";

describe("test", () => {
  it("should parse hex balance correctly", () => {
    const balance =
      "0x000000000000000000000000000000000000000000000003021246ae6cf66e2c";
    const uiAmount = parseBalance(balance);
    console.log(uiAmount);
  });

  it("should parse decimal balance correctly", () => {
    const balance = "123";
    const uiAmount = parseBalance(balance);
    console.log(uiAmount);
  });
});
