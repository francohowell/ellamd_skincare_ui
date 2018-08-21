import {Button, Dialog, Intent} from "@blueprintjs/core";
import {action, observable} from "mobx";
import {observer} from "mobx-react";
import * as React from "react";

import {VisitsApi} from "apis";
import {RiseTransitionGroup} from "components/common";
import {RegimenForm} from "components/regimens";
import {Customer, Regimen, Visit} from "models";
import {Toaster} from "utilities";

import * as styles from "./index.css";

interface Props {
  visit: Visit;
  customer: Customer;
  className?: string;
}

class Store {
  @observable public isDialogOpen: boolean;
  @observable public isUpdating: boolean;
  @observable public regimen: Regimen;

  private props: Props;

  constructor(props: Props) {
    this.props = props;
    this.isDialogOpen = false;
    this.isUpdating = false;
    this.regimen = this.props.visit.regimen || new Regimen({});
  }

  @action
  public openDialog = () => {
    this.isDialogOpen = true;
  };

  @action
  public closeDialog = () => {
    this.isDialogOpen = false;
  };

  @action
  public submitForm = async (): Promise<void> => {
    this.isUpdating = true;

    try {
      const visit = await VisitsApi.syncRegimen(this.props.visit, this.regimen);

      this.closeDialog();
      this.props.customer.updateVisit(visit);

      Toaster.show({
        message: "Regimen updated.",
        intent: Intent.SUCCESS,
        iconName: "tick",
      });
    } catch (error) {
      Toaster.show({
        message: error.message,
        intent: Intent.WARNING,
        iconName: "warning-sign",
      });
    } finally {
      this.stopUpdating();
    }
  };

  @action
  private stopUpdating(): void {
    this.isUpdating = false;
  }
}

@observer
export class UpdateRegimenForm extends React.Component<Props> {
  private store: Store;

  constructor(props: Props, context: any) {
    super(props, context);
    this.store = new Store(props);
  }

  public render() {
    return (
      <div className={`${styles.wrapper} ${this.props.className}`}>
        <Button className="pt-intent-primary pt-large" onClick={this.store.openDialog}>
          Update regimen
        </Button>

        <RiseTransitionGroup>{this.renderDialog()}</RiseTransitionGroup>
      </div>
    );
  }

  private renderDialog() {
    return (
      <Dialog
        isOpen={this.store.isDialogOpen}
        onClose={this.store.closeDialog}
        title="Suggested regimen"
      >
        <form>
          <div className="pt-dialog-body">
            <RegimenForm
              regimen={this.store.regimen}
              allowNewProducts={false}
              withIngredients={true}
            />
          </div>

          <div className="pt-dialog-footer">
            <div className="pt-dialog-footer-actions">
              <Button onClick={this.store.closeDialog}>Close</Button>
              <Button
                onClick={this.store.submitForm}
                loading={this.store.isUpdating}
                className="pt-intent-primary"
              >
                Save Regimen
              </Button>
            </div>
          </div>
        </form>
      </Dialog>
    );
  }
}
