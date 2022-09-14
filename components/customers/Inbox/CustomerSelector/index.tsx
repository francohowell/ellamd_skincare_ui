import * as React from "react";

import {Customer} from "models";

import * as styles from "./index.css";

interface Props {
  customers: Customer[];
  onSelect: (customer: Customer) => void;
  selected?: Customer;
}

interface State {}

export class CustomerSelector extends React.Component<Props, State> {
  private selectCustomer = (customer: Customer) => {
    this.props.onSelect(customer);
  }

  private renderCustomer = (customer: Customer) => {
    const {selected} = this.props;
    const className = selected && selected.id === customer.id ?
      styles.selected : "";

    return (
      <li key={customer.id} className={className} onClick={() => this.selectCustomer(customer)}>
        <a href="#">{customer.fullName}</a>
      </li>
    );
  }

  public render() {
    const {customers} = this.props;

    return (
      <ul className={styles.selector}>
        {customers.map(this.renderCustomer)}
      </ul>
    );
  }
}
