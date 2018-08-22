import {observable} from "mobx";

import {StripeCoupon} from "models";

export class SubscriptionDiscountDetails {
  @observable public coupon: StripeCoupon;

  constructor(fields: {[f in keyof SubscriptionDiscountDetails]: SubscriptionDiscountDetails[f]}) {
    Object.assign(this, {...fields});
  }
}
