import {inject, observer} from "mobx-react";
import * as moment from "moment";
import * as React from "react";

import {Customer, Physician} from "models";
import {IdentityStore} from "stores";

import * as styles from "../index.css";

interface Props {
  identityStore?: IdentityStore;
  by: Customer | Physician;
  at: moment.Moment;
}

@inject("identityStore")
@observer
export class StoryMeta extends React.Component<Props> {
  public render() {
    const {at, by} = this.props;
    const initials = `${by.firstName[0]}${by.lastName[0]}`;

    return (
      <div className={styles.meta}>
        <div className={styles.timeAndFrom}>
          <div className={styles.timeAgo} title={at.toString()}>
            {at.fromNow()}
          </div>
          <div className={styles.date}>{at.format("MMMM D")}</div>
          <div className={styles.from}>{this.renderFrom()}</div>
        </div>

        <div className={styles.avatar}>
          <div className={styles.avatarImage}>{initials}</div>
        </div>
      </div>
    );
  }

  public renderFrom(): string {
    const {by} = this.props;

    if (by instanceof Customer) {
      return "You";
    } else {
      return `Dr. ${by.firstName} ${by.lastName}`;
    }
  }
}
