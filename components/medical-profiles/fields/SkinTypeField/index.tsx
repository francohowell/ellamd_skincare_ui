import {observer} from "mobx-react";
import * as React from "react";

import {MEDICAL_PROFILE_FIELD_LABELS, SkinType} from "models";
import {MedicalProfileField} from "../MedicalProfileField";

import * as styles from "../index.css";

export const SKIN_TYPE_LABELS = {
  very_light: "Very light",
  light: "Light",
  light_to_medium: "Light to medium",
  medium: "Medium",
  medium_to_dark: "Medium to dark",
  dark: "Dark",
};

const SKIN_TYPE_DESCRIPTIONS = {
  very_light: "Always burns, never tans",
  light: "Usually burns, tans minimally",
  light_to_medium: "Sometimes burns mildly, tans uniformly",
  medium: "Burns minimally, always tans well",
  medium_to_dark: "Very rarely burns, tans very easily",
  dark: "Never burns, always tans",
};

const SWATCHES = {
  very_light: "#F4E5DE",
  light: "#F0DECE",
  light_to_medium: "#E2C8A5",
  medium: "#D0B083",
  medium_to_dark: "#B07E58",
  dark: "#533924",
};

@observer
export class SkinTypeField extends MedicalProfileField {
  public componentWillMount() {
    this.handleChange(this.props.medicalProfile.skinType || "very_light");
  }

  private renderSkinTypeLabel(skinType: SkinType, skinTypeIndex: number) {
    return (
      <div>
        <span className={styles.swatch}>
          <span style={{background: SWATCHES[skinType]}} />
        </span>
        <span className={styles.typeNumber}>Type {skinTypeIndex}</span>
        <span className={styles.typeName}>{SKIN_TYPE_LABELS[skinType]}</span>
        <span className={styles.typeDescription}>{SKIN_TYPE_DESCRIPTIONS[skinType]}</span>
      </div>
    );
  }

  public render() {
    return (
      <span className="pt-label">
        <h3>{MEDICAL_PROFILE_FIELD_LABELS.skinType}</h3>

        <p className={styles.labelDescription}>
          We develop your personalized formulation to match your skin's sensitivity to the sun.
        </p>

        <div className={styles.skinTypes}>
          {[
            SkinType.VeryLight,
            SkinType.Light,
            SkinType.LightToMedium,
            SkinType.Medium,
            SkinType.MediumToDark,
            SkinType.Dark,
          ].map((skinType: SkinType, index) => (
            <label
              className={[
                "pt-label",
                "pt-radio",
                skinType === this.props.medicalProfile.skinType ? styles.checked : undefined,
              ].join(" ")}
              key={skinType}
            >
              <input
                type="radio"
                onChange={event => {
                  if (event.target.checked) {
                    this.handleChange(event.target.value);
                  }
                }}
                value={skinType}
                checked={skinType === this.props.medicalProfile.skinType}
              />

              {this.renderSkinTypeLabel(skinType, index)}
            </label>
          ))}
        </div>
      </span>
    );
  }
}
