import {observer} from "mobx-react";
import * as React from "react";

import {Pharmacist} from "models";

import * as styles from "./index.css";

interface Props {
  pharmacist: Pharmacist;
}

@observer
export class PharmacistListItem extends React.Component<Props> {
  public render() {
    const {pharmacist} = this.props;

    return (
      <tr key={pharmacist.id}>
        <td className={styles.id}>#{pharmacist.id}</td>

        <td>
          <span className={styles.name}>{pharmacist.name}</span>
        </td>

        <td>{pharmacist.email}</td>
      </tr>
    );
  }
}
