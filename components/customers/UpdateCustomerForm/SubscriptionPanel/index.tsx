import {Button, Intent, Spinner} from "@blueprintjs/core";
import {inject, observer} from "mobx-react";
import * as moment from "moment";
import * as React from "react";
import {injectStripe, ReactStripeElements as RSE} from "react-stripe-elements";

import {CurrencyHelper, SubscriptionHelper} from "helpers";
import {StripeError, StripeInvoice, StripeSuccess, Subscription} from "models";
import {SubscriptionStore} from "stores";
import {Toaster} from "utilities";

import {CardField} from "components/subscriptions/CardField";

import * as styles from "./index.css";

interface Props {
  className?: string;
  subscription: Subscription;
  subscriptionStore?: SubscriptionStore;
  stripe?: RSE.StripeProps;
}

interface State {
  cardIsBeingUpdated: boolean;
  isLoading: boolean;
  subscriptionStateIsBeingUpdated: boolean;
}

@inject("subscriptionStore")
@observer
class SubscriptionPanelWithoutStripe extends React.Component<Props, State> {
  public state: State = {
    cardIsBeingUpdated: false,
    isLoading: false,
    subscriptionStateIsBeingUpdated: false,
  };

  private fetchSubscriptionPaymentDetails = async () => {
    const {subscription, subscriptionStore} = this.props;

    if (!subscription.paymentDetails) {
      this.setState({isLoading: true});
      await subscriptionStore!.fetchSubscriptionPaymentDetails(subscription);
      this.setState({isLoading: false});
    }
  };

  private updateCard = async () => {
    const {subscription, subscriptionStore} = this.props;
    this.setState({cardIsBeingUpdated: true});

    try {
      const stripeResult = await this.props.stripe!.createToken();

      if ((stripeResult as StripeSuccess).token === undefined) {
        throw (stripeResult as StripeError).error;
      }

      const stripeToken = (stripeResult as StripeSuccess).token.id;
      await subscriptionStore!.updateCard(subscription, stripeToken);
      await subscriptionStore!.fetchSubscriptionPaymentDetails(subscription);

      Toaster.show({
        message: "Your payment information has been updated",
        intent: Intent.SUCCESS,
        iconName: "tick",
      });
    } catch (error) {
      Toaster.show({message: error.message, intent: Intent.WARNING, iconName: "warning-sign"});
    }

    this.setState({cardIsBeingUpdated: false});
  };

  private startSubscription = async () => {
    const {subscription, subscriptionStore} = this.props;

    this.setState({subscriptionStateIsBeingUpdated: true});

    try {
      await subscriptionStore!.startSubscription(subscription);
      await subscriptionStore!.fetchSubscriptionPaymentDetails(subscription);

      Toaster.show({
        message: "Your subscription has started",
        intent: Intent.SUCCESS,
        iconName: "tick",
      });
    } catch (error) {
      Toaster.show({message: error.message, intent: Intent.WARNING, iconName: "warning-sign"});
    }

    this.setState({subscriptionStateIsBeingUpdated: false});
  };

  private cancelSubscription = async () => {
    const {subscription, subscriptionStore} = this.props;

    this.setState({subscriptionStateIsBeingUpdated: true});
    try {
      await subscriptionStore!.cancelSubscription(subscription);
      await subscriptionStore!.fetchSubscriptionPaymentDetails(subscription);

      Toaster.show({
        message: "Your subscription has been cancelled",
        intent: Intent.SUCCESS,
        iconName: "tick",
      });
    } catch (error) {
      Toaster.show({message: error.message, intent: Intent.WARNING, iconName: "warning-sign"});
    }
    this.setState({subscriptionStateIsBeingUpdated: false});
  };

  private renderInvoiceAmount(invoice: StripeInvoice) {
    return <span>{CurrencyHelper.formatCents(invoice.amountDue)}</span>;
  }

  private renderUpdateCardInformation() {
    const buttonClassName = [
      "pt-intent-success",
      "pt-large",
      "pt-fill",
      styles.updateCardButton,
    ].join(" ");

    return (
      <div>
        <CardField />
        <Button
          className={buttonClassName}
          onClick={this.updateCard}
          loading={this.state.cardIsBeingUpdated}
        >
          Update Card
        </Button>
      </div>
    );
  }

  private renderCurrentCardInformation() {
    const {card} = this.props.subscription.paymentDetails!;

    const currentCardInformation = () => {
      return (
        <div>
          <div className={styles.colHeader}>{SubscriptionHelper.formatCardNumber(card)}</div>
          <div className={styles.colHeader}>
            Expires {SubscriptionHelper.formatCardExpireDate(card)}
          </div>
        </div>
      );
    };

    return (
      <div className={styles.panelBlock}>
        <h3>Current Card</h3>
        {card ? currentCardInformation() : "There's no card information."}
      </div>
    );
  }

  private renderPreviousInvoice(invoice: StripeInvoice) {
    return (
      <div key={invoice.id}>
        <div className={styles.liCol}>
          <li>{this.renderInvoiceAmount(invoice)}</li>
        </div>
        <div className={styles.col}>
          {invoice.paid ? `paid on ${moment.unix(invoice.date).format("M/D/YYYY")}` : "unpaid"}
        </div>
      </div>
    );
  }

  private renderPreviousInvoices() {
    const {previousInvoices} = this.props.subscription.paymentDetails!;

    return (
      <div className={styles.panelBlock}>
        <h3>Previous Invoices</h3>
        <div>
          <div className={styles.col}>
            <h4>Amount</h4>
          </div>
          <div className={styles.col}>
            <h4>Status</h4>
          </div>
        </div>
        <div>
          {previousInvoices.map((invoice: StripeInvoice) => this.renderPreviousInvoice(invoice))}
        </div>
      </div>
    );
  }

  private renderUpcomingInvoice() {
    const {status} = this.props.subscription;
    const {upcomingInvoice} = this.props.subscription.paymentDetails!;
    let message: JSX.Element | undefined;

    if (!upcomingInvoice) {
      return;
    }

    if (status === "paused") {
      message = <div>Your subscription is paused</div>;
    } else {
      const amount = this.renderInvoiceAmount(upcomingInvoice);
      const date = moment.unix(upcomingInvoice.date).format("M/D/YYYY");

      message = (
        <div>
          You will be billed {amount} on {date} for a reformulation and another 60-day supply of
          your personalized skincare cream.
        </div>
      );
    }

    return (
      <div className={styles.panelBlock}>
        <h3>Upcoming Invoice</h3>
        {message}
      </div>
    );
  }

  private renderButtons() {
    const {subscription} = this.props;
    const buttonClassName = [
      "pt-large",
      "pt-intent-danger",
      "pt-fill",
      styles.subscriptionActionButton,
    ].join(" ");

    switch (subscription.status) {
      case "inexistent":
      case "cancelled":
        return (
          <Button
            className={buttonClassName}
            onClick={this.startSubscription}
            loading={this.state.subscriptionStateIsBeingUpdated}
          >
            Start subscription
          </Button>
        );
      case "active":
      case "unpaid":
      case "paused":
        return (
          <Button
            className={buttonClassName}
            onClick={this.cancelSubscription}
            loading={this.state.subscriptionStateIsBeingUpdated}
          >
            Cancel subscription
          </Button>
        );
    }
  }

  public componentWillMount() {
    this.fetchSubscriptionPaymentDetails();
  }

  public render() {
    if (this.state.isLoading) {
      return (
        <div className={styles.spinner}>
          <Spinner />
        </div>
      );
    }

    return (
      <div>
        {this.renderCurrentCardInformation()}
        {this.renderUpdateCardInformation()}
        {this.renderUpcomingInvoice()}
        {this.renderPreviousInvoices()}
        {this.renderButtons()}
      </div>
    );
  }
}

// tslint:disable-next-line variable-name
export const SubscriptionPanel = injectStripe(SubscriptionPanelWithoutStripe);
