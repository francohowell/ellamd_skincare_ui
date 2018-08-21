import * as React from "react";
import {RouteComponentProps} from "react-router-dom";

import {PrescriptionLists} from "components/prescriptions";

interface Props extends RouteComponentProps<any> {}

export class PharmacistDashboard extends React.Component<Props> {
  public render() {
    return (
      <div>
        <PrescriptionLists />
      </div>
    );
  }
}
