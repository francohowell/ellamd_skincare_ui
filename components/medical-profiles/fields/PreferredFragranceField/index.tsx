import {observer} from "mobx-react";
import * as React from "react";

import {MEDICAL_PROFILE_FIELD_LABELS} from "models";
import {MedicalProfileField} from "../MedicalProfileField";

@observer
export class PreferredFragranceField extends MedicalProfileField {
  public componentWillMount() {
    this.handleChange(this.props.medicalProfile.preferredFragrance || "no_scent");
  }

  public render() {
    return (
      <label className="pt-label">
        {MEDICAL_PROFILE_FIELD_LABELS.preferredFragrance}

        <span className="pt-select pt-large">
          <select
            onChange={event => this.handleChange(event.target.value)}
            value={this.props.medicalProfile.preferredFragrance}
          >
            <option value="no_scent">No scent</option>
            <option value="rose_hip">Rose hip</option>
            <option value="eucalyptus">Eucalyptus</option>
          </select>
        </span>
      </label>
    );
  }
}
