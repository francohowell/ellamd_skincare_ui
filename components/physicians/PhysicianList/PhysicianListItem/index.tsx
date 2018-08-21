import * as React from "react";

import {Physician} from "models";

import * as styles from "./index.css";

interface Props {
  physician: Physician;
}
interface State {}

export class PhysicianListItem extends React.Component<Props, State> {
  public render() {
    const {physician} = this.props;

    return (
      <tr key={physician.id}>
        <td className={styles.id}>
          #{physician.id}
        </td>

        <td>
          <span className={styles.name}>
            {physician.firstName} {physician.lastName}
          </span>
        </td>

        <td>
          {physician.email}
        </td>
      </tr>
    );
  }
}
