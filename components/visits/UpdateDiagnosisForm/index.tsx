import {Button, Checkbox, Dialog, Intent} from "@blueprintjs/core";
import {inject, observer} from "mobx-react";
import * as React from "react";

import {FadeTransitionGroup, RiseTransitionGroup, Spinner} from "components/common";
import {Condition, Customer, Visit} from "models";
import {ConditionStore, CustomerStore} from "stores";
import {Method, request, Status, SubmitEvent, Toaster} from "utilities";

import * as styles from "./index.css";

interface Props {
  customer: Customer;
  visit: Visit;
  className?: string;
  customerStore?: CustomerStore;
  conditionStore?: ConditionStore;
}
interface State {
  isOpen: boolean;
  conditionIds: number[];
  conditionDescriptions: {[id: number]: string};
  note: string;
  hasError: boolean;
  errorMessage?: string;
  isLoading: boolean;
}

@inject("customerStore", "conditionStore")
@observer
export class UpdateDiagnosisForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const {diagnosis} = props.visit;
    const conditionIds = diagnosis
      ? diagnosis.diagnosisConditions.map(diagnosisCondition => diagnosisCondition.condition.id)
      : [];
    const conditionDescriptions = diagnosis
      ? diagnosis.diagnosisConditions.reduce(
          (descriptions, diagnosisCondition) => ({
            ...descriptions,
            [diagnosisCondition.condition.id]: diagnosisCondition.description,
          }),
          {}
        )
      : {};

    this.state = {
      isOpen: false,
      conditionIds,
      conditionDescriptions,
      note: "",
      hasError: false,
      errorMessage: undefined,
      isLoading: false,
    };
  }

  public componentDidUpdate(_prevProps: Props, prevState: State) {
    const {visit: {diagnosis}} = this.props;

    if (!prevState.isOpen && this.state.isOpen) {
      this.setState({
        note: (diagnosis && diagnosis.note) || "",
      });
    }
  }

  private toggleForm = () => {
    this.setState({isOpen: !this.state.isOpen});
  };

  private handleConditionChange = (conditionId: number, event: React.FormEvent<HTMLElement>) => {
    const conditionIds = this.state.conditionIds;
    const {checked} = event.target as any;

    if (checked && !conditionIds.includes(conditionId)) {
      conditionIds.push(conditionId);

      const {conditionDescriptions} = this.state;
      const description = this.props.conditionStore!.getConditionDescription(conditionId);

      this.setState({
        conditionIds,
        conditionDescriptions: {...conditionDescriptions, [conditionId]: description},
        hasError: false,
      });
    } else if (!checked && conditionIds.includes(conditionId)) {
      const index = conditionIds.indexOf(conditionId);

      if (index >= 0) {
        conditionIds.splice(index, 1);
      }

      const {[conditionId]: _, ...conditionDescriptions} = this.state.conditionDescriptions;

      this.setState({conditionIds, conditionDescriptions, hasError: false});
    }
  };

  private handleNoteChange = (event: React.FormEvent<HTMLElement>) => {
    this.setState({note: (event.target as any).value, hasError: false});
  };

  private handleConditionDescriptionChange = (
    conditionId: number,
    event: React.FormEvent<HTMLElement>
  ) => {
    const {value} = event.target as any;
    const {conditionDescriptions} = this.state;

    this.setState({conditionDescriptions: {...conditionDescriptions, [conditionId]: value}});
  };

  private handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();
    const {note} = this.state;
    const conditions = this.state.conditionDescriptions;

    this.setState({isLoading: true, hasError: false});
    const response = await request(`visits/${this.props.visit.id}/diagnosis`, Method.POST, {
      conditions,
      note,
    });
    this.setState({isLoading: false});

    // tslint:disable-next-line switch-default
    switch (response.status) {
      case Status.Success:
        const {visit} = response.data! as {visit: Visit};

        this.props.customer.updateVisit(visit);
        Toaster.show({message: "Diagnosis updated.", intent: Intent.SUCCESS, iconName: "tick"});
        this.setState({note: "", isOpen: false});
        break;

      case Status.Error:
        this.setState({hasError: true, errorMessage: response.error, isLoading: false});
        break;
    }
  };

  public render() {
    return (
      <div className={[styles.wrapper, this.props.className].join(" ")}>
        <Button className="pt-intent-primary pt-large" onClick={this.toggleForm}>
          Update diagnosis
        </Button>

        <RiseTransitionGroup>{this.renderDialog()}</RiseTransitionGroup>
      </div>
    );
  }

  private renderDialog() {
    return (
      <Dialog isOpen={this.state.isOpen} onClose={this.toggleForm} title="New diagnosis">
        {this.renderForm()}
      </Dialog>
    );
  }

  private renderForm() {
    if (this.props.conditionStore!.isLoading) {
      return <Spinner title="Loading form..." />;
    }

    const {conditions} = this.props.conditionStore!;

    return (
      <form onSubmit={this.handleSubmit}>
        <div className="pt-dialog-body">
          {conditions !== undefined
            ? conditions.map(condition => (
                <div key={condition.id}>
                  <Checkbox
                    label={condition.name}
                    onChange={this.handleConditionChange.bind(this, condition.id)}
                    checked={this.state.conditionIds.includes(condition.id)}
                  />
                  {this.renderConditionDescription(condition)}
                </div>
              ))
            : undefined}

          <label className="pt-label">
            Notes
            <textarea
              className="pt-input pt-fill"
              onChange={this.handleNoteChange}
              value={this.state.note}
            />
          </label>

          <FadeTransitionGroup>{this.renderError()}</FadeTransitionGroup>
        </div>

        <div className="pt-dialog-footer">
          <div className="pt-dialog-footer-actions">
            <Button onClick={this.toggleForm}>Cancel</Button>

            <Button
              onClick={this.handleSubmit}
              className="pt-intent-primary"
              loading={this.state.isLoading}
              type="submit"
            >
              Update diagnosis
            </Button>
          </div>
        </div>
      </form>
    );
  }

  private renderConditionDescription(condition: Condition) {
    if (this.state.conditionIds.includes(condition.id)) {
      const description = this.state.conditionDescriptions[condition.id] || condition.description;

      return (
        <div className={styles.conditionDescriptionWrapper}>
          <textarea
            className="pt-input pt-fill"
            onChange={this.handleConditionDescriptionChange.bind(this, condition.id)}
            value={description}
          />
        </div>
      );
    }

    return;
  }

  private renderError() {
    if (!this.state.hasError) {
      return;
    }

    return (
      <div className={styles.errorWrapper}>
        <div className={styles.error}>{this.state.errorMessage}</div>
      </div>
    );
  }
}
