import * as React from "react";

import {MEDICAL_PROFILE_FIELD_LABELS, MedicalProfile} from "models";

import * as styles from "./index.css";

interface Props {
  medicalProfile: MedicalProfile;
  className?: string;
}

export class HistorySection extends React.Component<Props> {
  private renderQuestion(field: keyof MedicalProfile) {
    const {medicalProfile} = this.props;

    return (
      <div>
        <h4>{MEDICAL_PROFILE_FIELD_LABELS[field]}</h4>
        <p>
          {medicalProfile[field] !== false ? <span className={styles.warning}>yes</span> : "no"}
          {medicalProfile[field] !== false ? medicalProfile[field] : undefined}
        </p>
      </div>
    );
  }

  public render() {
    return (
      <section className={this.props.className}>
        <h3>History</h3>

        {this.renderQuestion("knownAllergies")}
        {this.renderQuestion("isSmoker")}
        {this.renderQuestion("hasBeenOnAccutane")}
        {this.renderQuestion("hasHormonalIssues")}
        {this.renderQuestion("isPregnant")}
        {this.renderQuestion("isBreastFeeding")}
        {this.renderQuestion("isOnBirthControl")}
        {this.renderQuestion("otherConcerns")}
        {this.renderQuestion("currentPrescriptionTopicalMedications")}
        {this.renderQuestion("pastPrescriptionTopicalMedications")}
        {this.renderQuestion("currentPrescriptionOralMedications")}
        {this.renderQuestion("pastPrescriptionOralMedications")}
        {this.renderQuestion("currentNonprescriptionTopicalMedications")}
        {this.renderQuestion("pastNonprescriptionTopicalMedications")}
      </section>
    );
  }
}
