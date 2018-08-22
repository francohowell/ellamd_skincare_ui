import {Spinner} from "@blueprintjs/core";
import {inject, observer} from "mobx-react";
import * as React from "react";

import {PhysicianStore} from "stores";
import {PhysicianListItem} from "./PhysicianListItem";

import * as styles from "./index.css";

interface Props {
  physicianStore?: PhysicianStore;
}
interface State {}

@inject("physicianStore")
@observer
export class PhysicianList extends React.Component<Props, State> {
  public componentWillMount() {
    this.props.physicianStore!.fetchPhysicians();
  }

  private renderPhysicians() {
    if (this.props.physicianStore!.isLoading) {
      return <Spinner />;
    }

    const {physicians} = this.props.physicianStore!;

    return (
      <table className={["pt-table", styles.table].join(" ")}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>

        <tbody>
          {physicians !== undefined
            ? physicians.map(physician =>
                <PhysicianListItem physician={physician} key={physician.email} />
              )
            : undefined}
        </tbody>
      </table>
    );
  }

  public render() {
    return (
      <div>
        <h2 className={styles.heading}>Physicians</h2>

        {this.renderPhysicians()}
      </div>
    );
  }
}
