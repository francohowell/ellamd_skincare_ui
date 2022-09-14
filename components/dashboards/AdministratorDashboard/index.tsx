import * as React from "react";
import {RouteComponentProps} from "react-router-dom";

import {CustomerList} from "components/customers";
import {PharmacistList} from "components/pharmacists";
import {PhysicianList} from "components/physicians";
import {Customer} from "models";

import * as styles from "./index.css";

interface Props extends RouteComponentProps<any> {}

export class AdministratorDashboard extends React.Component<Props> {
  public render() {
    const renderStatus = (customer: Customer) => {
      return <span>${customer.subscription.status}</span>;
    };

    return (
      <div>
        <CustomerList renderStatus={renderStatus} />

        <div className={styles.columns}>
          <PhysicianList />
          <PharmacistList />
        </div>
      </div>
    );
  }
}
