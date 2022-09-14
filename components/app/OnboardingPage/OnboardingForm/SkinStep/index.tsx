import {observer} from "mobx-react";
import * as React from "react";

import {
  DateOfBirthField,
  MedicalProfileField,
  SexField,
  SkinConcernsField,
  SkinTypeField,
  SunscreenFrequencyField,
} from "components/medical-profiles";
import {MedicalProfile} from "models";

import * as styles from "../index.css";

interface Props {
  medicalProfile: MedicalProfile;
}

@observer
export class SkinStep extends React.Component<Props> {
  public render() {
    const {medicalProfile} = this.props;

    return (
      <div>
        <div className={styles.skinConcernsAndType}>
          <SkinConcernsField field="skinConcerns" medicalProfile={medicalProfile} />

          <hr />

          <SkinTypeField field="skinType" medicalProfile={medicalProfile} />
        </div>

        <hr />

        <h3 className={styles.label}>Personal information</h3>
        <div className={[styles.columns, styles.dateOfBirthAndSex].join(" ")}>
          <DateOfBirthField field="dateOfBirth" medicalProfile={medicalProfile} />
          <SexField field="sex" medicalProfile={medicalProfile} />
        </div>

        <div className={styles.columns}>
          <div>
            <h3 className={styles.label}>General conditions</h3>
            {this.renderFemaleSpecificQuestions()}
            <MedicalProfileField
              field="knownAllergies"
              type="question"
              medicalProfile={medicalProfile}
            />
          </div>
          <div>
            <h3 className={styles.label}>Current medication</h3>
            <MedicalProfileField
              field="currentPrescriptionTopicalMedications"
              type="question"
              medicalProfile={medicalProfile}
            />
            <MedicalProfileField
              field="currentPrescriptionOralMedications"
              type="question"
              medicalProfile={medicalProfile}
            />
          </div>
        </div>

        <h3 className={styles.label}>Skin Profile</h3>
        <div>
          <SunscreenFrequencyField field="sunscreenFrequency" medicalProfile={medicalProfile} />
          <MedicalProfileField field="usingPeels" type="question" medicalProfile={medicalProfile} />
          <MedicalProfileField
            field="usingRetinol"
            type="question"
            medicalProfile={medicalProfile}
          />
          <MedicalProfileField
            field="userSkinExtraDetails"
            type="text"
            medicalProfile={medicalProfile}
          />
        </div>
      </div>
    );
  }

  private renderFemaleSpecificQuestions() {
    const {medicalProfile} = this.props;

    if (medicalProfile.sex === "male") {
      return;
    }

    return (
      <div>
        <MedicalProfileField field="isPregnant" type="question" medicalProfile={medicalProfile} />
        <MedicalProfileField
          field="isBreastFeeding"
          type="question"
          medicalProfile={medicalProfile}
        />
      </div>
    );
  }
}
