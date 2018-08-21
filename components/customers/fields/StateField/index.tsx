import {observer} from "mobx-react";
import * as React from "react";

import {CustomerField} from "components/customers/fields";
import {CUSTOMER_FIELD_LABELS} from "models";

import * as styles from "../index.css";

const STATES = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvani",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];

@observer
export class StateField extends CustomerField {
  public componentWillMount() {
    this.handleChange(this.props.customer.state || "California");
  }

  public render() {
    const {customer} = this.props;

    return (
      <div className="pt-label">
        <div className={styles.label}>{CUSTOMER_FIELD_LABELS.state}</div>

        <span className="pt-select pt-fill pt-large">
          <select value={customer.state} onChange={event => this.handleChange(event.target.value)}>
            {STATES.map(state => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </span>
      </div>
    );
  }
}
