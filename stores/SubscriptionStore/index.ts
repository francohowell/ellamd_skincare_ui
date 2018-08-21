import {action, observable} from "mobx";

import {
  MedicalProfile,
  Subscription,
  SubscriptionDiscountDetails,
  SubscriptionPaymentDetails,
} from "models";

import {Method, request, Status} from "utilities";

export class SubscriptionStore {
  @observable public isLoading: boolean = false;

  @action
  public fetchSubscriptionPaymentDetails = async (subscription: Subscription) => {
    this.setIsLoading(true);
    const response = await request(`subscriptions/${subscription.id}/payment-details`, Method.GET);
    this.setIsLoading(false);

    if (response.status === Status.Error) {
      throw new Error(response.error);
    }

    const details = new SubscriptionPaymentDetails(response.data!.paymentDetails);
    subscription.setField("paymentDetails", details);
  };

  @action
  public fetchSubscriptionDiscountDetails = async (subscription: Subscription) => {
    this.setIsLoading(true);
    const response = await request(`subscriptions/${subscription.id}/discount-details`, Method.GET);
    this.setIsLoading(false);

    if (response.status === Status.Error) {
      throw new Error(response.error);
    }

    const details = new SubscriptionDiscountDetails(response.data!.discountDetails);
    subscription.setField("discountDetails", details);
  };

  @action
  public updateCard = async (subscription: Subscription, stripeToken: string) => {
    this.setIsLoading(true);
    const response = await request(`subscriptions/${subscription.id}/update-card`, Method.POST, {
      stripeToken,
    });
    this.setIsLoading(false);

    if (response.status === Status.Error) {
      throw new Error(response.error);
    }
  };

  @action
  public applyCode = async (subscription: Subscription, code: string) => {
    this.setIsLoading(true);
    const response = await request(`subscriptions/${subscription.id}/apply-code`, Method.POST, {
      code,
    });
    this.setIsLoading(false);

    if (response.status === Status.Error) {
      throw new Error(response.error);
    }

    const subscriptionFields = response.data!.subscription as Subscription;
    subscription.setFields(subscriptionFields);
    subscription.setField("discountDetails", undefined);
  };

  @action
  public startSubscription = async (subscription: Subscription, stripeToken?: string) => {
    this.setIsLoading(true);
    const response = await request(`subscriptions/${subscription.id}/start`, Method.POST, {
      stripeToken,
    });
    this.setIsLoading(false);

    switch (response.status) {
      case Status.Success:
        const subscriptionFields = response.data!.subscription as Subscription;
        subscription.setFields(subscriptionFields);
        break;

      case Status.Error:
        throw new Error(response.error);
    }
  };

  @action
  public unpauseSubscription = async (
    subscription: Subscription,
    medicalProfile: MedicalProfile
  ) => {
    this.setIsLoading(true);
    const response = await request(`subscriptions/${subscription.id}/unpause`, Method.POST, {
      medicalProfile,
    });
    this.setIsLoading(false);

    switch (response.status) {
      case Status.Success:
        const subscriptionFields = response.data!.subscription as Subscription;
        subscription.setFields(subscriptionFields);
        break;

      case Status.Error:
        throw new Error(response.error);
    }
  };

  @action
  public cancelSubscription = async (subscription: Subscription) => {
    this.setIsLoading(true);
    const response = await request(`subscriptions/${subscription.id}/cancel`, Method.POST);
    this.setIsLoading(false);

    switch (response.status) {
      case Status.Success:
        const subscriptionFields = response.data!.subscription as Subscription;
        subscription.setFields(subscriptionFields);
        break;

      case Status.Error:
        throw new Error(response.error);
    }
  };

  @action
  private setIsLoading(isLoading: boolean) {
    this.isLoading = isLoading;
  }
}
