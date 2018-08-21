import {Radio} from "@blueprintjs/core";
import {observer} from "mobx-react";
import * as React from "react";

import {
  DEFAULT_DETAILS_LABEL,
  MEDICAL_PROFILE_DETAILS_LABELS,
  MEDICAL_PROFILE_FIELD_LABELS,
  MedicalProfile,
} from "models";

import * as styles from "../index.css";

interface Props {
  field: keyof MedicalProfile;
  medicalProfile: MedicalProfile;
  type?: "text" | "boolean" | "question" | "detail";
  placeholder?: string;
}

@observer
export class MedicalProfileField extends React.Component<Props> {
  public static defaultProps: Partial<Props> = {
    type: "text",
  };

  protected handleChange = (value: any) => {
    this.props.medicalProfile.setField(this.props.field, value);
  };

  public componentWillMount() {
    const {medicalProfile, field} = this.props;

    // Initialize the field on the given MedicalProfile.
    if (this.props.type === "text" || this.props.type === "detail") {
      this.handleChange(medicalProfile[field] || "");
    } else if (this.props.type === "boolean") {
      this.handleChange(medicalProfile[field] || false);
    }
  }

  private renderTextField() {
    return (
      <input
        type={this.props.type}
        className="pt-input pt-fill pt-large"
        placeholder={this.props.placeholder}
        onChange={event => this.handleChange(event.target.value)}
        value={(this.props.medicalProfile[this.props.field] as string) || ""}
      />
    );
  }

  private renderBooleanField() {
    return (
      <div>
        <Radio
          className="pt-inline"
          label="yes"
          onChange={_event => this.handleChange(true)}
          checked={!!this.props.medicalProfile[this.props.field]}
        />
        <Radio
          className="pt-inline"
          label="no"
          onChange={_event => this.handleChange(false)}
          checked={!this.props.medicalProfile[this.props.field]}
        />
      </div>
    );
  }

  private renderDetailField() {
    const {medicalProfile, field} = this.props;

    return (
      <div>
        <span className={styles.additionalDetailsLabel}>
          {MEDICAL_PROFILE_DETAILS_LABELS[field] || DEFAULT_DETAILS_LABEL}
        </span>
        <input
          type="text"
          className="pt-input pt-fill"
          placeholder="Details…"
          onChange={event => this.handleChange(event.target.value)}
          value={(medicalProfile[field] as string) || ""}
        />
      </div>
    );
  }

  private renderQuestionField() {
    const {medicalProfile, field} = this.props;

    let detailsField;
    if (medicalProfile[field] !== false) {
      detailsField = this.renderDetailField();
    }

    return (
      <div>
        <Radio
          label="yes"
          className="pt-inline"
          onChange={_event => this.handleChange("")}
          checked={medicalProfile[field] !== false}
        />
        <Radio
          label="no"
          className="pt-inline"
          onChange={_event => this.handleChange(false)}
          checked={medicalProfile[field] === false}
        />

        {detailsField}
      </div>
    );
  }

  public render() {
    let renderedField;
    switch (this.props.type) {
      case "text":
        renderedField = this.renderTextField();
        break;

      case "boolean":
        renderedField = this.renderBooleanField();
        break;

      case "question":
        renderedField = this.renderQuestionField();
        break;

      case "detail":
        return this.renderDetailField();
    }

    return (
      <label className="pt-label">
        <div className={styles.label}>{MEDICAL_PROFILE_FIELD_LABELS[this.props.field]}</div>

        {renderedField}
      </label>
    );
  }
}
