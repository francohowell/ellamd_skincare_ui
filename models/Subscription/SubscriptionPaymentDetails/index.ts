import {observable} from "mobx";

import {StripeCard, StripeInvoice} from "models";

export class SubscriptionPaymentDetails {
  @observable public card: StripeCard;
  @observable public upcomingInvoice: StripeInvoice;
  @observable public previousInvoices: StripeInvoice[];

  constructor(fields: {[f in keyof SubscriptionPaymentDetails]: SubscriptionPaymentDetails[f]}) {
    Object.assign(this, {...fields});
  }
}
