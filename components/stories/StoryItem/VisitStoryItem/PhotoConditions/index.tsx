import {observer} from "mobx-react";
import * as React from "react";
import * as Sticky from "react-stickynode";

import {TextWithNewlines} from "components/common";
import {DiagnosisCondition, Id, Visit} from "models";

import {Photo} from "./Photo";

import * as styles from "./index.css";

interface Props {
  visit: Visit;
}

interface State {
  selectedConditionId?: Id;
  diagnosisConditions: DiagnosisCondition[];
}

@observer
export class PhotoConditions extends React.Component<Props, State> {
  public state: State = {selectedConditionId: undefined, diagnosisConditions: []};

  public componentWillMount() {
    this.setDiagnosisConditions();
  }

  private setDiagnosisConditions() {
    const diagnosisConditions: DiagnosisCondition[] = [];

    if (this.props.visit.diagnosis) {
      this.props.visit.diagnosis.diagnosisConditions.forEach(diagnosisCondition => {
        diagnosisConditions.push({
          condition: diagnosisCondition.condition,
          description: diagnosisCondition.description,
        });
      });
    }

    this.props.visit.photos.forEach(photo => {
      photo.photoConditions.forEach(photoCondition => {
        const groupedCondition = diagnosisConditions.find(
          condition => condition.condition.id === photoCondition.condition.id
        );

        if (groupedCondition) {
          if (photoCondition.note) {
            if (groupedCondition.description === "") {
              groupedCondition.description = photoCondition.note;
            } else {
              groupedCondition.description += "\n\n" + photoCondition.note;
            }
          }
        } else {
          diagnosisConditions.push({
            condition: photoCondition.condition,
            description: photoCondition.note,
          });
        }
      });
    });

    this.setState({diagnosisConditions});
  }

  public render() {
    return (
      <div className={styles.container} id="photo-conditions-container">
        <div className={styles.list}>
          <Sticky top="#header" bottomBoundary="#photo-conditions-container">
            <div className={styles.inner}>
              {this.state.diagnosisConditions.map(diagnosisCondition => (
                <div
                  key={diagnosisCondition.condition.id}
                  className={[
                    styles.condition,
                    this.state.selectedConditionId === diagnosisCondition.condition.id
                      ? styles.isSelected
                      : undefined,
                  ].join(" ")}
                  onMouseEnter={() =>
                    this.setState({selectedConditionId: diagnosisCondition.condition.id})
                  }
                  onMouseLeave={() => this.setState({selectedConditionId: undefined})}
                >
                  <span className={styles.name}>{diagnosisCondition.condition.name}</span>
                  <p className={styles.description}>
                    <TextWithNewlines text={diagnosisCondition.description} />
                  </p>
                </div>
              ))}
            </div>
          </Sticky>
        </div>

        <div className={styles.photos}>
          <Sticky top="#header" bottomBoundary="#photo-conditions-container">
            <div className={styles.inner}>
              {this.props.visit.photos.map(photo => (
                <Photo
                  key={photo.id}
                  photo={photo}
                  selectedConditionId={this.state.selectedConditionId}
                />
              ))}
            </div>
          </Sticky>
        </div>
      </div>
    );
  }
}
