import {SubscriptionHelper} from "helpers";
import {StripeCard} from "models";

describe("formatCard", () => {
  test("correctly renders Visa, MasterCard and American Express card numbers", () => {
    let card: StripeCard = {
      brand: "Visa",
      last4: "4321",
      exp_month: 8,
      exp_year: 2030,
    };

    expect(SubscriptionHelper.formatCardNumber(card)).toEqual("XXXX-XXXX-XXXX-4321");

    card.brand = "MasterCard";
    expect(SubscriptionHelper.formatCardNumber(card)).toEqual("XXXX-XXXX-XXXX-4321");

    card.brand = "American Express";
    expect(SubscriptionHelper.formatCardNumber(card)).toEqual("XXXX-XXXXXX-X4321");
  });
});
