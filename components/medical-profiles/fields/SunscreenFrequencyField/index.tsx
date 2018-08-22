import {observer} from "mobx-react";
import * as React from "react";

import {FREQUENCY_LABELS, FrequencyOptions, MEDICAL_PROFILE_FIELD_LABELS} from "models";
import {MedicalProfileField} from "../MedicalProfileField";

@observer
export class SunscreenFrequencyField extends MedicalProfileField {
  protected handleChange = (value: any) => {
    this.props.medicalProfile.setField(this.props.field, value);

    if (value === FrequencyOptions.Never) {
      this.props.medicalProfile.setField("sunscreenBrand", "");
    }
  };

  private renderSunscreenBrandField() {
    const {field, medicalProfile} = this.props;

    if (!medicalProfile[field] || medicalProfile[field] === FrequencyOptions.Never) {
      return;
    }

    return (
      <label className="pt-label">
        <MedicalProfileField field="sunscreenBrand" type="detail" medicalProfile={medicalProfile} />
      </label>
    );
  }

  public render() {
    const {medicalProfile} = this.props;

    return (
      <fieldset name="sunscreen" className="pt-fieldset">
        <label className="pt-label">
          {MEDICAL_PROFILE_FIELD_LABELS.sunscreenFrequency}

          <span className="pt-select pt-large">
            <select
              onChange={event => this.handleChange(event.target.value)}
              value={medicalProfile.sunscreenFrequency || FrequencyOptions.Never}
            >
              {Object.keys(FrequencyOptions).map((frequency: keyof typeof FrequencyOptions) => (
                <option key={frequency} value={FrequencyOptions[frequency]}>
                  {FREQUENCY_LABELS[FrequencyOptions[frequency]]}
                </option>
              ))}
            </select>
          </span>
        </label>

        {this.renderSunscreenBrandField()}
      </fieldset>
    );
  }
}
