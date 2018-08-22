import * as moment from "moment";
import * as React from "react";

import {Customer} from "models";

import * as styles from "./index.css";

interface Props {
  customer: Customer;
  className?: string;
}
interface State {}

export class ProgressSection extends React.Component<Props, State> {
  private renderProgress() {
    const {customer} = this.props;

    const visit = customer.visits[customer.visits.length - 1];
    const prescription = visit.prescription;

    if (
      visit.status === "needs fulfillment" ||
      visit.status === "needs tracking" ||
      !prescription
    ) {
      return (
        <p>
          Sit tight, the pharmacy is processing your custom formulation. You’ll receive an email
          confirmation when it’s shipped and on its way!
        </p>
      );
    }

    const dayCount = moment().diff(moment(prescription.fulfilledAt), "days");
    const widthFraction = dayCount / 60;
    const width = `${(widthFraction > 1 ? 1 : widthFraction) * 100}%`;

    if (dayCount <= 0) {
      return (
        <p>
          Your custom formulation is on its way! Your tracking number is{" "}
          {prescription.trackingUrl ?
            <a href={prescription.trackingUrl}>{prescription.trackingNumber}</a>
            :
            prescription.trackingNumber
          }
        </p>
      );
    }

    return (
      <div>
        <span className={styles.start}>{moment(prescription.fulfilledAt).format("MMMM Do")}</span>

        <div className="pt-progress-bar pt-intent-primary pt-no-stripes">
          <div className="pt-progress-meter" style={{width}} />
        </div>

        <p className={styles.congratulations}>
          Congratulations! You’re {dayCount} {dayCount === 1 ? "day" : "days"} into your treatment.
        </p>
      </div>
    );
  }

  public render() {
    return (
      <div className={this.props.className}>
        <h2>Your progress</h2>

        {this.renderProgress()}
      </div>
    );
  }
}
