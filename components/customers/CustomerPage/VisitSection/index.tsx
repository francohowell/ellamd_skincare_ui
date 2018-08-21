import {Button, Intent} from "@blueprintjs/core";
import {observer} from "mobx-react";
import * as moment from "moment";
import * as React from "react";

import {RegimenBlock} from "components/regimens";
import {
  UpdateAnnotationsForm,
  UpdateDiagnosisForm,
  UpdatePrescriptionForm,
  UpdateRegimenForm,
} from "components/visits";
import {Customer, Visit} from "models";
import {Method, request, Status, SubmitEvent, Toaster} from "utilities";

import {DiagnosisCard} from "./DiagnosisCard";
import {PrescriptionCard} from "./PrescriptionCard";

import * as styles from "./index.css";

export * from "./PhotosCard";

interface Props {
  customer: Customer;
  visit: Visit;
  number: number;
  className?: string;
}

interface State {
  isLoading: boolean;
}

@observer
export class VisitSection extends React.Component<Props, State> {
  public state: State = {
    isLoading: false,
  };

  public render() {
    const {customer, visit} = this.props;

    return (
      <section className={[this.props.className, styles.visitSection].join(" ")}>
        {this.renderDeleteButton()}

        <h2>
          Visit #{this.props.number}
          {visit && this.renderSectionTimestamp(visit.createdAt)}
        </h2>

        <div className={styles.visitSubsection}>
          <div className={styles.column}>
            <h3>Photos &amp; annotations</h3>

            <div className={styles.editButton}>
              <UpdateAnnotationsForm visit={visit} customer={customer} />
            </div>
          </div>

          <div className={styles.column}>
            <h3>
              Regimen
              {visit.regimen && this.renderSectionTimestamp(visit.regimen.createdAt!)}
            </h3>

            <div className={styles.editButton}>
              <UpdateRegimenForm visit={visit} customer={customer} />
            </div>

            <RegimenBlock regimen={visit.regimen} />
          </div>
        </div>

        <div className={styles.visitSubsection}>
          <div className={styles.column}>
            <h3>
              Diagnosis
              {visit.diagnosis && this.renderSectionTimestamp(visit.diagnosis.createdAt)}
            </h3>

            <div className={styles.editButton}>
              <UpdateDiagnosisForm visit={visit} customer={customer} />
            </div>

            {this.renderDiagnosisSection(visit)}
          </div>

          <div className={styles.column}>
            <h3>
              Prescription
              {visit.prescription && this.renderSectionTimestamp(visit.prescription.createdAt)}
            </h3>

            <div className={styles.editButton}>
              <UpdatePrescriptionForm visit={visit} customer={customer} />
            </div>

            {this.renderPrescriptionSection(visit)}
          </div>
        </div>
      </section>
    );
  }

  private renderDiagnosisSection(visit: Visit) {
    if (visit.diagnosis === undefined) {
      return <span>No diagnosis</span>;
    }

    return <DiagnosisCard diagnosis={visit.diagnosis} />;
  }

  private renderPrescriptionSection(visit: Visit) {
    if (visit.prescription === undefined) {
      return <span>No prescription</span>;
    }

    return <PrescriptionCard prescription={visit.prescription} />;
  }

  private renderDeleteButton() {
    const {visit} = this.props;

    // You can't delete a Visit that is not empty.
    if (visit.photos.length > 0 || visit.regimen || visit.diagnosis || visit.prescription) {
      return;
    }

    return (
      <Button intent={Intent.DANGER} onClick={this.handleDelete} className={styles.deleteButton}>
        Delete
      </Button>
    );
  }

  private handleDelete = async (event: SubmitEvent) => {
    event.preventDefault();

    this.setState({isLoading: true});
    const response = await request(`visits/${this.props.visit.id}/delete`, Method.POST);
    this.setState({isLoading: false});

    // tslint:disable-next-line switch-default
    switch (response.status) {
      case Status.Success:
        this.props.customer.deleteVisit(this.props.visit);
        Toaster.show({
          message: "Visit deleted.",
          intent: Intent.SUCCESS,
          iconName: "cross",
        });
        break;
    }
  };

  private renderSectionTimestamp(timestamp: string | moment.Moment) {
    return (
      <span className={styles.timestamp}>Created at {moment(timestamp).format("M/D/YYYY")}</span>
    );
  }
}
