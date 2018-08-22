import {observer} from "mobx-react";
import * as moment from "moment";
import * as React from "react";

import {
  Audit,
  Fragrance,
  FRAGRANCE_LABELS,
  FREQUENCY_LABELS,
  FrequencyOptions,
  MEDICAL_PROFILE_FIELD_LABELS,
  MedicalProfile,
  MedicalProfileQuestion,
  Sex,
  SKIN_TYPE_LABELS,
  SkinType,
} from "models";

interface Props {
  audit: Audit<MedicalProfile>;
}

@observer
export class MedicalProfileAuditStoryItem extends React.Component<Props> {
  public render() {
    const {auditedChanges} = this.props.audit;

    return (
      <div>
        <h1>You have updated your profile</h1>
        <div>
          {Object.entries(auditedChanges).map(([field, values], index) => {
            const oldValue = values![0];
            const newValue = values![1];

            return (
              <div key={index}>
                {this.renderAuditedChange(field as keyof MedicalProfile, oldValue, newValue)}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // TODO: add some kind of runtime type information to medical profile fields and dispatch based on it
  private renderAuditedChange(field: keyof MedicalProfile, oldValue: any, newValue: any) {
    switch (field) {
      case "sex":
        return this.renderSexFieldChange(newValue as Sex);
      case "dateOfBirth":
        return this.renderDateOfBirthFieldChange(newValue);
      case "isSmoker":
      case "isPregnant":
      case "isBreastFeeding":
      case "isOnBirthControl":
      case "knownAllergies":
      case "currentPrescriptionTopicalMedications":
      case "currentPrescriptionOralMedications":
      case "currentNonprescriptionTopicalMedications":
      case "pastNonprescriptionTopicalMedications":
      case "pastPrescriptionTopicalMedications":
      case "pastPrescriptionOralMedications":
      case "usingPeels":
      case "usingRetinol":
      case "hasBeenOnAccutane":
      case "hasHormonalIssues":
      case "otherConcerns":
        return this.renderQuestionFieldChange(field, newValue as MedicalProfileQuestion);
      case "preferredFragrance":
        return this.renderPreferredFragranceChange(newValue as Fragrance);
      case "skinType":
        return this.renderSkinTypeChange(newValue as SkinType);
      case "skinConcerns":
        return this.renderSkinConcerns(oldValue, newValue);
      case "sunscreenFrequency":
        return this.renderFrequencyOptions(newValue);
      case "sunscreenBrand":
        return this.renderString("your sunscreen brand", newValue);
      case "userSkinExtraDetails":
        return this.renderString("extra details", newValue);
      default:
        throw new Error(`MedicalProfileAuditStoryItem: Unknown MedicalProfile field: ${field}`);
    }
  }

  private renderString(description: string, value: string) {
    return (
      <div>
        You have changed your {description} to <b>{value}</b>.
      </div>
    );
  }

  private renderSexFieldChange(sex: Sex) {
    return (
      <div>
        You have changed your sex to <b>{sex}</b>.
      </div>
    );
  }

  private renderDateOfBirthFieldChange(date: string) {
    return (
      <div>
        You have changed your date of birth to <b>{moment(date).format("YYYY-MM-DD")}</b>.
      </div>
    );
  }

  private renderQuestionFieldChange(field: keyof MedicalProfile, newValue: MedicalProfileQuestion) {
    const formattedValue = newValue !== undefined ? ` YES. ${newValue}` : " NO.";
    const questionLabel = MEDICAL_PROFILE_FIELD_LABELS[field];

    return (
      <div>
        You have changed your answer to question <b>{questionLabel}</b> to <b>{formattedValue}</b>
      </div>
    );
  }

  private renderPreferredFragranceChange(newValue: Fragrance) {
    const formattedFragrance = FRAGRANCE_LABELS[newValue];

    return (
      <div>
        You have changed your preferred fragrance to <b>{formattedFragrance}</b>.
      </div>
    );
  }

  private renderSkinTypeChange(skinType: SkinType) {
    return (
      <div>
        You have changed your skin type to <b>{SKIN_TYPE_LABELS[skinType]}</b>.
      </div>
    );
  }

  private renderSkinConcerns(before: string[], after: string[]) {
    const removed = before.filter(c => !after.includes(c));
    const added = after.filter(c => !before.includes(c));

    return (
      <div>
        {added.length > 0 && (
          <span>
            You have added skin concern{added.length > 1 ? "s: " : ": "}
            <b>{added.join(", ")}</b>.
          </span>
        )}
        {removed.length > 0 && (
          <span>
            {added.length > 0 && <br />}
            You have removed skin concern{removed.length > 1 ? "s: " : ": "}
            <b>{removed.join(", ")}</b>.
          </span>
        )}
      </div>
    );
  }

  private renderFrequencyOptions(frequency: FrequencyOptions) {
    return (
      <div>
        You have changed your sunscreen usage frequency to <b>{FREQUENCY_LABELS[frequency]}</b>.
      </div>
    );
  }
}
