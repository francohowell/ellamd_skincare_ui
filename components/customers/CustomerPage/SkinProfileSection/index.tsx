import * as React from "react";

import {SKIN_TYPE_LABELS} from "components/medical-profiles";
import {FREQUENCY_LABELS, MEDICAL_PROFILE_FIELD_LABELS, MedicalProfile} from "models";

interface Props {
  medicalProfile: MedicalProfile;
  className?: string;
}

export class SkinProfileSection extends React.Component<Props> {
  private renderSunscreenInformation() {
    const {medicalProfile} = this.props;

    return (
      <div>
        <h4>{MEDICAL_PROFILE_FIELD_LABELS.sunscreenFrequency}</h4>
        <p>{FREQUENCY_LABELS[medicalProfile.sunscreenFrequency]}</p>

        {medicalProfile.sunscreenBrand && (
          <div>
            <h4>Sunscreen Brand</h4>
            <p>{medicalProfile.sunscreenBrand}</p>
          </div>
        )}
      </div>
    );
  }

  public render() {
    const {medicalProfile} = this.props;

    return (
      <section className={this.props.className}>
        <h3>Skin profile</h3>

        <h4>{MEDICAL_PROFILE_FIELD_LABELS.skinConcerns}</h4>
        <p>{(medicalProfile.skinConcerns || []).join(", ")}</p>

        <h4>{MEDICAL_PROFILE_FIELD_LABELS.skinType}</h4>
        <p>{medicalProfile.skinType ? SKIN_TYPE_LABELS[medicalProfile.skinType] : "?"}</p>

        {this.renderSunscreenInformation()}

        <h4>{MEDICAL_PROFILE_FIELD_LABELS.usingPeels}</h4>
        <p>{medicalProfile.usingPeels ? medicalProfile.usingPeels : "?"}</p>

        <h4>{MEDICAL_PROFILE_FIELD_LABELS.usingRetinol}</h4>
        <p>{medicalProfile.usingRetinol ? medicalProfile.usingRetinol : "?"}</p>

        <h4>{MEDICAL_PROFILE_FIELD_LABELS.userSkinExtraDetails}</h4>
        <p>{this.props.medicalProfile.userSkinExtraDetails}</p>
      </section>
    );
  }
}
