export type StripeSuccess = {token: {id: string}};
export type StripeError = {error: {message: string}};

export interface StripeCard {
  brand: string;
  last4: string;
  expMonth: string;
  expYear: string;
}

export interface StripeCoupon {
  id: number;
  amountOff?: number;
  percentOff?: number;
  duration: "once" | "repeating" | "forever";
  durationInMonths?: number;
}

export interface StripeInvoice {
  id?: number;
  currency: string;
  amountDue: number;
  paid: boolean;
  date: number;
}
