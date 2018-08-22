import {observer} from "mobx-react";
import * as React from "react";

import {MEDICAL_PROFILE_FIELD_LABELS} from "models";

import {MedicalProfileField} from "../MedicalProfileField";

import * as styles from "../index.css";

const SKIN_CONCERNS = [
  "acne",
  "scarring",
  "sun damage/sunspots",
  "fine lines/wrinkles",
  "rough skin",
  "dryness",
  "redness",
  "uneven complexion",
  "eye puffiness",
  "undereye darkening",
];

const SKIN_CONCERN_IMAGES = {
  acne: require("assets/images/skinConcerns/acne.svg"),
  scarring: require("assets/images/skinConcerns/scarring.svg"),
  "sun damage/sunspots": require("assets/images/skinConcerns/sunspots.svg"),
  "uneven complexion": require("assets/images/skinConcerns/unevenComplexion.svg"),
  "rough skin": require("assets/images/skinConcerns/roughness.svg"),
  dryness: require("assets/images/skinConcerns/dryness.svg"),
  "fine lines/wrinkles": require("assets/images/skinConcerns/wrinkles.svg"),
  "eye puffiness": require("assets/images/skinConcerns/undereyePuffiness.svg"),
  "undereye darkening": require("assets/images/skinConcerns/undereyeDarkness.svg"),
  redness: require("assets/images/skinConcerns/redness.svg"),
};

@observer
export class SkinConcernsField extends MedicalProfileField {
  public componentWillMount() {
    this.handleChange([...(this.props.medicalProfile.skinConcerns || [])]);
  }

  private handlePresetChange = (skinConcern: string, isChecked: boolean) => {
    const skinConcerns = [...(this.props.medicalProfile.skinConcerns || [])];

    if (isChecked && !skinConcerns.includes(skinConcern)) {
      // New concern we need to add:
      skinConcerns.push(skinConcern);
    } else if (!isChecked && skinConcerns.includes(skinConcern)) {
      // Old concern we need to remove:
      const index = skinConcerns.indexOf(skinConcern);
      if (index >= 0) {
        skinConcerns.splice(index, 1);
      }
    }

    this.handleChange(skinConcerns);
  };

  private handleOtherChange = (otherSkinConcern: string) => {
    let skinConcerns = [...(this.props.medicalProfile.skinConcerns || [])];

    // Remove any existing "other" concern:
    skinConcerns = skinConcerns.filter(skinConcern => SKIN_CONCERNS.includes(skinConcern));

    // Add our new "other" concern:
    if (otherSkinConcern) {
      skinConcerns.push(otherSkinConcern);
    }

    this.handleChange(skinConcerns);
  };

  public render() {
    return (
      <span className="pt-label">
        <h3>{MEDICAL_PROFILE_FIELD_LABELS.skinConcerns}</h3>

        <p className={styles.labelDescription}>
          To ensure that your personalized formulation is developed to address your top skin
          concerns, please select them below:
        </p>

        <div className={styles.concerns}>
          {SKIN_CONCERNS.map(skinConcern => (
            <div
              className={[
                styles.concern,
                (this.props.medicalProfile.skinConcerns || []).includes(skinConcern)
                  ? styles.selected
                  : undefined,
              ].join(" ")}
              key={skinConcern}
              onClick={_event =>
                this.handlePresetChange(
                  skinConcern,
                  !(this.props.medicalProfile.skinConcerns || []).includes(skinConcern)
                )}
            >
              <img src={(SKIN_CONCERN_IMAGES as any)[skinConcern]} />
              <span className={styles.label}>{skinConcern.replace("/", " / ")}</span>
            </div>
          ))}

          <div className={[styles.concern, styles.hidden].join(" ")} />
          <div className={[styles.concern, styles.hidden].join(" ")} />
        </div>

        <input
          type="text"
          className="pt-input pt-fill pt-large"
          placeholder="Other skin concerns…"
          onChange={event => this.handleOtherChange(event.target.value)}
          value={(this.props.medicalProfile.skinConcerns || [])
            .filter(skinConcern => !SKIN_CONCERNS.includes(skinConcern))
            .join(", ")}
        />
      </span>
    );
  }
}
