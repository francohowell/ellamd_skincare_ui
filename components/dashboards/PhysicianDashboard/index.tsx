import * as React from "react";
import {RouteComponentProps} from "react-router-dom";

import {CustomerList} from "components/customers";
import {Customer} from "models";

import * as styles from "../AdministratorDashboard/index.css";

interface Props extends RouteComponentProps<any> {}

export class PhysicianDashboard extends React.Component<Props> {
  public render() {
    const renderStatus = (customer: Customer) => {
      const visitWithoutPrescription = customer.visits.find(visit => !visit.prescription);

      if (!visitWithoutPrescription) {
        return <span>RX assigned</span>;
      } else if (visitWithoutPrescription.alreadyPaid) {
        return <span className={styles.attentionRequired}>RX required</span>;
      } else {
        return <span>Awaiting payment</span>;
      }
    };

    return (
      <div>
        <CustomerList
          customerLabel="Patient"
          canCreate={false}
          renderStatus={renderStatus}
          forPhysician={true}
        />
      </div>
    );
  }
}
