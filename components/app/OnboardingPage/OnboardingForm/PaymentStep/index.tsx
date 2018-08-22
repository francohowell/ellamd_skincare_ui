import {Intent} from "@blueprintjs/core";
import {inject, observer} from "mobx-react";
import * as React from "react";
import {Link} from "react-router-dom";

import {Customer} from "models";
import {SubscriptionStore} from "stores";
import {ROUTES, Toaster} from "utilities";

import {AddressField, CustomerField, StateField} from "components/customers";
import {CardField, PromotionalCodeField, WhatYouGet} from "components/subscriptions";

import * as styles from "../index.css";

interface Props {
  customer: Customer;
  subscriptionStore?: SubscriptionStore;
}

interface State {}

@inject("subscriptionStore")
@observer
export class PaymentStep extends React.Component<Props, State> {
  private submitPromoCode = async (promoCode: string) => {
    if (!promoCode) return;

    try {
      await this.props.subscriptionStore!.applyCode(this.props.customer.subscription, promoCode);

      Toaster.show({
        message: "Your promotional code has been applied!",
        intent: Intent.SUCCESS,
        iconName: "tick",
      });
    } catch (error) {
      Toaster.show({
        message: error.message,
        intent: Intent.WARNING,
        iconName: "warning-sign",
      });
    }
  };

  private renderPromotionalCodeField() {
    const {subscription} = this.props.customer;

    if (subscription.initialTreatmentPlanIsFree || subscription.stripeCouponId) {
      return;
    }

    return <PromotionalCodeField onSubmit={this.submitPromoCode} />;
  }

  private renderPaymentForm() {
    const {subscription} = this.props.customer;

    if (subscription.initialTreatmentPlanIsFree) {
      return;
    }

    if (subscription.isActive) {
      return (
        <div className={styles.information}>
          <p>Thanks for your payment!</p>
        </div>
      );
    }

    return (
      <div className={styles.paymentForm}>
        <WhatYouGet subscription={subscription} />

        <div>
          <label className="pt-label">
            Card information
            <CardField />
          </label>
        </div>
      </div>
    );
  }

  public render() {
    return (
      <div>
        {this.renderPromotionalCodeField()}
        {this.renderPaymentForm()}

        <h3 className={styles.label}>Shipping information</h3>
        <div className={styles.shippingInformation}>
          <CustomerField field="phone" customer={this.props.customer} />

          <div className={styles.columns}>
            <AddressField customer={this.props.customer} />
            <CustomerField field="addressLine2" customer={this.props.customer} />
          </div>

          <div className={styles.columns}>
            <CustomerField field="city" customer={this.props.customer} />
            <StateField field="state" customer={this.props.customer} />
            <CustomerField field="zipCode" customer={this.props.customer} />
          </div>
        </div>

        <p className={styles.legalNotes}>
          By clicking “Finish” below, you agree that have read to and accept our{" "}
          <Link to={ROUTES.termsOfUse} target="_blank">
            Terms of Use
          </Link>,{" "}
          <Link to={ROUTES.privacyPolicy} target="_blank">
            Privacy Policy
          </Link>, and{" "}
          <Link to={ROUTES.privacyPractices} target="_blank">
            Notice of Privacy Practices
          </Link>.
        </p>
      </div>
    );
  }
}
