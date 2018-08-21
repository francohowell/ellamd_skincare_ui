import * as moment from "moment";
import * as React from "react";

import {Visit} from "models";

import * as styles from "./index.css";

interface Props {
  number: number;
  visit: Visit;
}
interface State {}

export class VisitListItem extends React.Component<Props, State> {
  private statusSections(visit: Visit) {
    // prettier-ignore
    switch (visit.status) {
      case "needs photos":
        return [
          [],
          ["needs photos"],
          ["needs RX", "needs payment", "needs FF", "needs tracking", "done"],
        ];
      case "needs prescription":
        return [
          ["has photos"],
          ["needs RX"],
          ["needs payment", "needs FF", "needs tracking", "done"],
        ];
      case "needs payment":
        return [
          ["has photos", "has RX"],
          ["needs payment"],
          ["needs FF", "needs tracking", "done"],
        ];
      case "needs fulfillment":
        return [
          ["has photos", "has RX", "has payment"],
          ["needs FF"],
          ["needs tracking", "done"],
        ];
      case "needs tracking":
        return [
          ["has photos", "has RX", "has payment", "has FF"],
          ["needs tracking"],
          ["done"],
        ];
      case "done":
        return [
          ["has photos", "has RX", "has payment", "has FF", "has tracking"],
          ["done"],
          [],
        ];
    }
  }

  public render() {
    const {visit} = this.props;
    const sections = this.statusSections(visit);

    return (
      <div className={styles.visit}>
        <div className={styles.numberAndDate}>
          <span className={styles.number}>Visit #{this.props.number}</span>
          <span className={styles.date}>{moment(visit.createdAt).format("M/D/YY")}</span>
        </div>

        <div className={styles.statusSections}>
          {sections[0].map((section, index) => (
            <span
              key={`section-1-${index}`}
              className={[styles.section, styles.completed].join(" ")}
            >
              {section}
            </span>
          ))}
          {sections[1].map((section, index) => (
            <span
              key={`section-2-${index}`}
              className={[styles.section, styles.inProgress].join(" ")}
            >
              {section}
            </span>
          ))}
          {sections[2].map((section, index) => (
            <span key={`section-3-${index}`} className={[styles.section, styles.pending].join(" ")}>
              {section}
            </span>
          ))}
        </div>
      </div>
    );
  }
}
