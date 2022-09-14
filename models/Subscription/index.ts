import {action, computed, observable} from "mobx";

import {Id} from "models";

import {SubscriptionDiscountDetails} from "./SubscriptionDiscountDetails";
import {SubscriptionPaymentDetails} from "./SubscriptionPaymentDetails";

export * from "./SubscriptionPaymentDetails";
export * from "./SubscriptionDiscountDetails";

export type SubscriptionStatus = "inexistent" | "active" | "unpaid" | "paused" | "cancelled";

export class Subscription {
  @observable public id: Id;
  @observable public status: SubscriptionStatus;
  @observable public stripeCustomerId?: string;
  @observable public stripeSubscriptionId?: string;
  @observable public stripeCouponId?: string;
  @observable public initialTreatmentPlanIsFree: boolean;
  @observable public nextVisitAt?: string;
  @observable public nextChargeAt?: string;
  @observable public hasPaymentSource?: boolean;
  @observable public needsTreatmentPlan?: boolean;
  @observable public needsProfileUpdate?: boolean;

  @observable public paymentDetails?: SubscriptionPaymentDetails;
  @observable public discountDetails?: SubscriptionDiscountDetails;

  constructor(fields: {[field in keyof Subscription]: Subscription[field]}) {
    this.setFields(fields);
  }

  @computed
  get isActive(): boolean {
    return this.status === "active";
  }

  @computed
  get cost(): number {
    if (!this.discountDetails) {
      return this.baseCost;
    }

    const {coupon} = this.discountDetails;

    // either amountOff or percentOff is present
    if (coupon.amountOff) {
      return Math.ceil(this.baseCost - coupon.amountOff);
    } else {
      return Math.ceil(this.baseCost * (1 - coupon.percentOff! / 100));
    }
  }

  get baseCost(): number {
    return 100 * 100; // $100 in cents
  }

  @action
  public setField(field: keyof Subscription, value: any) {
    Object.assign(this, {[field]: value});
  }

  @action
  public setFields(fields: {[field in keyof Subscription]: Subscription[field]}) {
    Object.assign(this, {...fields});

    if (fields.paymentDetails) {
      this.paymentDetails = observable(new SubscriptionPaymentDetails(fields.paymentDetails));
    }

    if (fields.discountDetails) {
      this.discountDetails = observable(new SubscriptionDiscountDetails(fields.discountDetails));
    }
  }
}
