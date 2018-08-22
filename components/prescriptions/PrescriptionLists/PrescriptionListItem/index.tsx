import {Button, InputGroup, Spinner} from "@blueprintjs/core";
import {action, observable} from "mobx";
import {observer} from "mobx-react";
import {asyncAction} from "mobx-utils";
import * as React from "react";

import {PrescriptionsApi} from "apis";
import {notifyDanger, notifySuccess} from "lib";
import {Prescription} from "models";

import {DownloadPDFButton} from "./DownloadPDFButton";

import * as styles from "./index.css";

interface Props {
  prescription: Prescription;
}

class Store {
  @observable public isLoading: boolean;
  @observable public trackingNumber: string;

  private props: Props;

  constructor(props: Props) {
    this.props = props;

    this.isLoading = false;
    this.trackingNumber = "";
  }

  @action
  public setTrackingNumber(trackingNumber: string): void {
    this.trackingNumber = trackingNumber;
  }

  @asyncAction
  public *submitTrackingNumber(): IterableIterator<Promise<void>> {
    this.isLoading = true;

    try {
      yield PrescriptionsApi.addTrackingNumber(this.props.prescription, this.trackingNumber);
      notifySuccess("Tracking number submitted");
    } catch (error) {
      notifyDanger("Invalid tracking number");
    } finally {
      this.isLoading = false;
    }
  }
}

@observer
export class PrescriptionListItem extends React.Component<Props> {
  private store: Store;

  constructor(props: Props) {
    super(props);
    this.store = new Store(props);
  }

  public render() {
    const {prescription} = this.props;

    return (
      <tr key={prescription.id}>
        <td className={styles.id}>{prescription.token}</td>

        <td>
          <span className={styles.name}>{prescription.customerName}</span>
        </td>

        <td>{prescription.createdAt.format("M/D/YY")}</td>

        <td>{this.renderDownloadCell()}</td>

        <td>{this.renderTrackingCell()}</td>
      </tr>
    );
  }

  private renderTrackingCell() {
    const {prescription} = this.props;

    if (this.store.isLoading || !prescription.fulfilledAt) {
      return;
    }

    if (prescription.trackingNumber) {
      return <strong>{prescription.trackingNumber}</strong>;
    }

    return (
      <div>
        <InputGroup
          type="text"
          onChange={(event: React.FormEvent<HTMLInputElement>) => {
            this.store.setTrackingNumber((event.target as any).value);
          }}
          value={this.store.trackingNumber}
          placeholder="Tracking number"
          rightElement={
            <Button
              className="pt-minimal pt-intent-primary"
              onClick={() => this.store.submitTrackingNumber()}
              iconName="plus"
            />
          }
        />
      </div>
    );
  }

  private renderDownloadCell() {
    const {prescription} = this.props;

    if (this.store.isLoading) {
      return <Spinner className="pt-small" />;
    }

    return <DownloadPDFButton prescription={prescription} />;
  }
}
