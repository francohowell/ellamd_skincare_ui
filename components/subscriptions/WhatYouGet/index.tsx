import {Spinner} from "@blueprintjs/core";
import {inject, observer} from "mobx-react";
import * as React from "react";

import {CurrencyHelper} from "helpers";
import {Subscription} from "models";
import {SubscriptionStore} from "stores";

import * as styles from "./index.css";

interface Props {
  subscription: Subscription;
  subscriptionStore?: SubscriptionStore;
}

@inject("subscriptionStore")
@observer
export class WhatYouGet extends React.Component<Props> {
  private renderPriceColumn() {
    const {subscription} = this.props;
    const {discountDetails} = subscription;

    if (!discountDetails || discountDetails.coupon.duration === "forever") {
      return (
        <div>
          <strong className={styles.price}>{CurrencyHelper.formatCents(subscription.cost)}</strong>
          <div className={styles.priceRemark}>billed every 2 months</div>
        </div>
      );
    }

    if (discountDetails.coupon.duration === "once") {
      return (
        <div>
          <strong className={styles.price}>{CurrencyHelper.formatCents(subscription.cost)}</strong>
          <div className={styles.priceRemark}>first payment</div>
          <div className={styles.priceRemark}>
            {CurrencyHelper.formatCents(subscription.baseCost)} billed every 2 months later on
          </div>
        </div>
      );
    }

    // Duration is "repeating"
    return (
      <div>
        <strong className={styles.price}>{CurrencyHelper.formatCents(subscription.cost)}</strong>
        <div className={styles.priceRemark}>
          billed every 2 months first {discountDetails.coupon.durationInMonths} months
        </div>
        <div className={styles.priceRemark}>
          {CurrencyHelper.formatCents(subscription.baseCost)} billed every 2 months later on
        </div>
      </div>
    );
  }

  public render() {
    const {subscription, subscriptionStore} = this.props;

    if (subscription.stripeCouponId && !subscription.discountDetails) {
      subscriptionStore!.fetchSubscriptionDiscountDetails(subscription);
    }

    if (subscriptionStore!.isLoading) {
      return (
        <div className={styles.information}>
          <div className={styles.spinner}>
            <Spinner />
          </div>
        </div>
      );
    }

    return (
      <div>
        <h3 className={styles.label}>What you get</h3>

        <div className={styles.information}>
          <div className={styles.columns}>
            {this.renderPriceColumn()}

            <div>
              <img src={require("assets/images/product.svg")} />
              <h4>2 months of EllaMD</h4>
              <p>
                A consultation with one of our board-certified dermatologists and your first 2-month
                supply of your personalized, medical-grade cream.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
