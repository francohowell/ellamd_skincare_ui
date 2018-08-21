import * as moment from "moment";
import * as React from "react";
import {Redirect} from "react-router-dom";

import {Customer} from "models";
import {ROUTES} from "utilities";

import {VisitListItem} from "./VisitListItem";

import * as styles from "./index.css";

interface Props {
  customer: Customer;
  renderStatus: (customer: Customer) => JSX.Element;
  isClickable?: boolean;
}
interface State {
  isClicked: boolean;
}

export class CustomerListItem extends React.Component<Props, State> {
  public static defaultProps: Partial<Props> = {
    isClickable: true,
  };

  public state: State = {
    isClicked: false,
  };

  private handleClick = () => {
    if (this.props.isClickable) {
      this.setState({isClicked: true});
    }
  };

  public render() {
    const {customer} = this.props;
    const viewPath = ROUTES.customersShow.replace(":id", customer.id.toString());

    return (
      <div className={styles.row} onClick={this.handleClick}>
        <div className={styles.fields}>
          <div className={[styles.field, styles.id].join(" ")}>
            #{customer.id}
            {this.state.isClicked ? <Redirect to={viewPath} push={true} /> : undefined}
          </div>

          <div className={[styles.field, styles.nameField].join(" ")}>
            <span className={styles.name}>
              {customer.firstName} {customer.lastName}
            </span>
            <span className={styles.email}>{customer.email}</span>
          </div>

          <div className={styles.field}>
            {moment(customer.createdAt).format("M/D/YY")}
            <span className={styles.label}>Created</span>
          </div>

          <div className={styles.field}>
            {customer.photosCount}
            <span className={styles.label}>Photos</span>
          </div>
        </div>

        <div className={styles.visits}>
          {customer.visits.map((visit, index) => (
            <VisitListItem key={index} visit={visit} number={index + 1} />
          ))}
        </div>
      </div>
    );
  }
}
