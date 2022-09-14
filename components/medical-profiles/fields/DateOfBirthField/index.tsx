import {observer} from "mobx-react";
import * as moment from "moment";
import * as React from "react";

import {MEDICAL_PROFILE_FIELD_LABELS} from "models";

import {MedicalProfileField} from "../MedicalProfileField";

import * as styles from "../index.css";

@observer
export class DateOfBirthField extends MedicalProfileField {
  public componentWillMount() {
    this.handleDateOfBirthChange({});
  }

  private handleDateOfBirthChange({
    year,
    month,
    date,
  }: {
    year?: number;
    month?: number;
    date?: number;
  }) {
    let dateOfBirth = this.props.medicalProfile.dateOfBirth
      ? moment(this.props.medicalProfile.dateOfBirth)
      : moment();

    if (year !== undefined) {
      dateOfBirth = dateOfBirth.year(year);
    }
    if (month !== undefined) {
      dateOfBirth = dateOfBirth.month(month);
    }
    if (date !== undefined) {
      dateOfBirth = dateOfBirth.date(date);
    }

    this.handleChange(dateOfBirth.format());
  }

  private yearList() {
    const currentYear = new Date().getFullYear();
    const years = [];
    let year = 1900;

    while (year <= currentYear) {
      years.push(year++);
    }

    return years;
  }

  private dateList() {
    const dates = [];
    let date = 1;

    while (date <= 31) {
      dates.push(date++);
    }

    return dates;
  }

  public render() {
    const {medicalProfile} = this.props;
    const dateOfBirth =
      medicalProfile && medicalProfile.dateOfBirth ? moment(medicalProfile.dateOfBirth) : moment();

    return (
      <span className={["pt-label", styles.dateOfBirthField].join(" ")}>
        {MEDICAL_PROFILE_FIELD_LABELS.dateOfBirth}

        <div className={styles.columns}>
          <span className="pt-select pt-large pt-fill">
            <select
              value={dateOfBirth.month()}
              onChange={event =>
                this.handleDateOfBirthChange({month: parseInt(event.target.value, 10)})}
            >
              <option value={0}>January</option>
              <option value={1}>February</option>
              <option value={2}>March</option>
              <option value={3}>April</option>
              <option value={4}>May</option>
              <option value={5}>June</option>
              <option value={6}>July</option>
              <option value={7}>August</option>
              <option value={8}>September</option>
              <option value={9}>October</option>
              <option value={10}>November</option>
              <option value={11}>December</option>
            </select>
          </span>

          <span className="pt-select pt-large pt-fill">
            <select
              value={dateOfBirth.date()}
              onChange={event =>
                this.handleDateOfBirthChange({date: parseInt(event.target.value, 10)})}
            >
              {this.dateList().map(date => (
                <option value={date} key={date}>
                  {date}
                </option>
              ))}
            </select>
          </span>

          <span className="pt-select pt-large pt-fill">
            <select
              value={dateOfBirth.year()}
              onChange={event =>
                this.handleDateOfBirthChange({year: parseInt(event.target.value, 10)})}
            >
              {this.yearList().map(year => (
                <option value={year} key={year}>
                  {year}
                </option>
              ))}
            </select>
          </span>
        </div>
      </span>
    );
  }
}
