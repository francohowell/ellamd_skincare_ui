import * as React from "react";

import {Customer} from "models";

interface Props {
  customer: Customer;
  className?: string;
}
interface State {}

export class ContactInformationSection extends React.Component<Props, State> {
  public render() {
    const {customer} = this.props;

    return (
      <section className={this.props.className}>
        <h3>Contact information</h3>

        <h4>Email</h4>
        <p>
          {customer.email}
        </p>

        <h4>Phone</h4>
        <p>
          {customer.phone || "???-???-????"}
        </p>

        <h4>Address</h4>
        <p>
          {customer.addressLine1 || "???"}
          <br />
          {customer.addressLine2}
          {customer.addressLine2 ? <br /> : undefined}
          {customer.city || "???"}, {customer.state || "??"} {customer.zipCode || "?????"}
        </p>
      </section>
    );
  }
}
