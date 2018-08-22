import {inject, observer} from "mobx-react";
import * as React from "react";

import {Spinner} from "components/common";
import {CreatePharmacistForm} from "components/pharmacists";
import {PharmacistStore} from "stores";

import {PharmacistListItem} from "./PharmacistListItem";

import * as styles from "./index.css";

interface Props {
  pharmacistStore?: PharmacistStore;
}

@inject("pharmacistStore")
@observer
export class PharmacistList extends React.Component<Props> {
  public render() {
    if (this.props.pharmacistStore!.isLoading) {
      return <Spinner />;
    }

    return (
      <div>
        <CreatePharmacistForm className={styles.createForm} />

        <h2 className={styles.heading}>Pharmacists</h2>

        {this.renderPharmacists()}
      </div>
    );
  }

  private renderPharmacists() {
    const {pharmacists} = this.props.pharmacistStore!;

    return (
      <table className={`pt-table ${styles.table}`}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>

        <tbody>
          {pharmacists.map(pharmacist => {
            return <PharmacistListItem pharmacist={pharmacist} key={pharmacist.email} />;
          })}
        </tbody>
      </table>
    );
  }
}
