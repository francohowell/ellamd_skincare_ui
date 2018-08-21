import {Radio} from "@blueprintjs/core";
import {observer} from "mobx-react";
import * as React from "react";

import {MEDICAL_PROFILE_FIELD_LABELS} from "models";

import {MedicalProfileField} from "../MedicalProfileField";

import * as styles from "../index.css";

@observer
export class SexField extends MedicalProfileField {
  public render() {
    const {medicalProfile} = this.props;

    return (
      <span className="pt-label">
        <div className={styles.label}>{MEDICAL_PROFILE_FIELD_LABELS.sex}</div>

        <Radio
          className="pt-inline"
          label="male"
          onChange={_event => this.handleChange("male")}
          checked={medicalProfile.sex === "male"}
        />
        <Radio
          className="pt-inline"
          label="female"
          onChange={_event => this.handleChange("female")}
          checked={medicalProfile.sex === "female"}
        />
      </span>
    );
  }
}
