import {observer} from "mobx-react";
import * as React from "react";

import {TextWithNewlines} from "components/common";
import {Diagnosis} from "models";

import * as styles from "./index.css";

interface Props {
  diagnosis: Diagnosis;
}

@observer
export class DiagnosisCard extends React.Component<Props> {
  public render() {
    const {diagnosis} = this.props;

    return (
      <div className={styles.diagnosis}>
        <ul>
          {diagnosis.diagnosisConditions.map(diagnosisCondition => (
            <li className={styles.condition} key={diagnosisCondition.condition.name}>
              {diagnosisCondition.condition.name}
            </li>
          ))}
        </ul>

        <h4>Notes</h4>
        <p>
          <TextWithNewlines text={diagnosis.note} />
        </p>
      </div>
    );
  }
}
