import {StripeCard} from "models";

export namespace SubscriptionHelper {
  export const formatCardNumber = (card: StripeCard): string => {
    switch (card.brand) {
      case "American Express":
        return `XXXX-XXXXXX-X${card.last4}`;
      default:
        return `XXXX-XXXX-XXXX-${card.last4}`;
    }
  };

  export const formatCardExpireDate = (card: StripeCard): string => {
    return `${card.expMonth}/${card.expYear}`;
  };
}
