import {Radio} from "@blueprintjs/core";
import {observer} from "mobx-react";
import * as React from "react";

import {Customer, CUSTOMER_FIELD_LABELS} from "models";

import * as styles from "../index.css";

interface Props {
  field: keyof Customer;
  customer: Customer;
  type?: "text" | "password" | "boolean";
  placeholder?: string;
}

@observer
export class CustomerField extends React.Component<Props> {
  public static defaultProps: Partial<Props> = {
    type: "text",
  };

  protected handleChange = (value: any) => {
    this.props.customer.setField(this.props.field, value);
  };

  public componentWillMount() {
    const {customer, field} = this.props;

    // Initialize the field on the given Customer.
    if (this.props.type === "text" || this.props.type === "password") {
      this.handleChange(customer[field] || "");
    } else if (this.props.type === "boolean") {
      this.handleChange(customer[field] || false);
    }
  }

  private renderTextField() {
    return (
      <input
        type={this.props.type}
        className="pt-input pt-fill pt-large"
        placeholder={this.props.placeholder}
        onChange={event => this.handleChange(event.target.value)}
        value={(this.props.customer[this.props.field] as string) || ""}
      />
    );
  }

  private renderBooleanField() {
    return (
      <div>
        <Radio
          className="pt-inline"
          label="yes"
          onChange={_event => this.handleChange(true)}
          checked={!!this.props.customer[this.props.field]}
        />
        <Radio
          className="pt-inline"
          label="no"
          onChange={_event => this.handleChange(false)}
          checked={!this.props.customer[this.props.field]}
        />
      </div>
    );
  }

  public render() {
    let renderedField;
    switch (this.props.type) {
      case "text":
      case "password":
        renderedField = this.renderTextField();
        break;

      case "boolean":
        renderedField = this.renderBooleanField();
        break;
    }

    return (
      <label className="pt-label">
        <div className={styles.label}>{CUSTOMER_FIELD_LABELS[this.props.field]}</div>

        {renderedField}
      </label>
    );
  }
}
