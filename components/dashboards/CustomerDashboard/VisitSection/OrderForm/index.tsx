import {Button, Dialog, Intent} from "@blueprintjs/core";
import {inject, observer} from "mobx-react";
import * as React from "react";
import {injectStripe, ReactStripeElements as RSE} from "react-stripe-elements";

import {CurrencyHelper} from "helpers";
import {StripeError, StripeSuccess, Subscription} from "models";
import {SubscriptionStore} from "stores";
import {SubmitEvent, Toaster} from "utilities";

import {FadeTransitionGroup} from "components/common";
import {CardField} from "components/subscriptions";
import * as styles from "./index.css";

interface Props {
  subscription: Subscription;
  subscriptionStore?: SubscriptionStore;
  className?: string;
  stripe?: RSE.StripeProps;
}

interface State {
  isOpen: boolean;
  hasError: boolean;
  errorMessage?: string;
  isLoading: boolean;
}

@inject("subscriptionStore")
@observer
class OrderFormWithoutStripe extends React.Component<Props, State> {
  public state: State = {
    isOpen: false,
    hasError: false,
    errorMessage: undefined,
    isLoading: false,
  };

  private toggleForm = () => {
    this.setState({isOpen: !this.state.isOpen});
  };

  private handleSubmit = async (event: SubmitEvent) => {
    const {subscription, subscriptionStore} = this.props;
    event.preventDefault();

    if (this.state.isLoading) {
      return;
    }

    this.setState({isLoading: true});

    try {
      const stripeResult = await this.props.stripe!.createToken();

      if ((stripeResult as StripeSuccess).token === undefined) {
        throw (stripeResult as StripeError).error;
      }

      const stripeToken = (stripeResult as StripeSuccess).token.id;
      await subscriptionStore!.startSubscription(subscription, stripeToken);

      this.setState({isLoading: false, isOpen: false});

      Toaster.show({
        message: "Thanks! Your formulation is on its way!",
        intent: Intent.SUCCESS,
        iconName: "tick",
      });
    } catch (error) {
      this.setState({hasError: true, errorMessage: error.message, isLoading: false});

      Toaster.show({
        message: error.message,
        intent: Intent.WARNING,
        iconName: "warning-sign",
      });
    }
  };

  private renderError() {
    if (!this.state.hasError) {
      return;
    }

    return (
      <div className={styles.errorWrapper}>
        <div className="pt-callout pt-intent-danger">{this.state.errorMessage}</div>
      </div>
    );
  }

  private renderForm() {
    const {subscription} = this.props;

    const creditCardForm = (
      <div className={styles.paymentForm}>
        <h3 className={styles.label}>Card information</h3>
        <p>The EllaMD beta is {CurrencyHelper.formatCents(subscription.cost)} for:</p>
        <ul>
          <li>A consultation with one of our board certified dermatologists.</li>
          <li>
            A 60-day supply (including one reformulation) of our personalized, medical-grade cream.
          </li>
          <li>
            Ongoing guidance and support from the entire EllaMD team to ensure you have a great
            experience. If you have a breakout, email us. If you have any issues, email us. If you…
            you get the idea 😉
          </li>
        </ul>

        <CardField />
      </div>
    );

    return (
      <Dialog isOpen={this.state.isOpen} onClose={this.toggleForm} title="Join the beta">
        <form onSubmit={this.handleSubmit}>
          <div className="pt-dialog-body">
            {creditCardForm}

            <FadeTransitionGroup>{this.renderError()}</FadeTransitionGroup>
          </div>

          <div className="pt-dialog-footer">
            <div className="pt-dialog-footer-actions">
              <Button onClick={this.toggleForm}>Cancel</Button>
              <Button
                onClick={this.handleSubmit}
                loading={this.state.isLoading}
                className="pt-intent-primary"
                type="submit"
              >
                Order formulation
              </Button>
            </div>
          </div>
        </form>
      </Dialog>
    );
  }

  public render() {
    return (
      <div className={[styles.wrapper, this.props.className].join(" ")}>
        <Button className="pt-large pt-intent-success pt-fill" onClick={this.toggleForm}>
          Subscribe and get your formulation (receive your 60-day supply)
        </Button>

        {this.renderForm()}
      </div>
    );
  }
}

// tslint:disable-next-line variable-name
export const OrderForm = injectStripe(OrderFormWithoutStripe);
