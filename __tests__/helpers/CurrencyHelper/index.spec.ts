import {CurrencyHelper} from "helpers";

describe("formatCents", () => {
  test("renders string correctly when given amount is whole-dollar", () => {
    expect(CurrencyHelper.formatCents(1200)).toEqual("$12");
  });

  test("renders string correctly when given amount has cents part", () => {
    expect(CurrencyHelper.formatCents(1210)).toEqual("$12.10");
    expect(CurrencyHelper.formatCents(1213)).toEqual("$12.13");
  });
});
