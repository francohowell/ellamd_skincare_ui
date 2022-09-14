import {Button, Dialog, Intent} from "@blueprintjs/core";
import {inject, observer} from "mobx-react";
import * as React from "react";

import {RiseTransitionGroup} from "components/common";
import {Customer} from "models";
import {CustomerStore} from "stores";
import {history, Method, request, ROUTES, Status, SubmitEvent, Toaster} from "utilities";

import * as styles from "./index.css";

interface Props {
  customer: Customer;
  customerStore?: CustomerStore;
  className?: string;
}
interface State {
  isOpen: boolean;
  isLoading: boolean;
}

@inject("customerStore")
@observer
export class ArchiveCustomerForm extends React.Component<Props, State> {
  public state: State = {
    isOpen: false,
    isLoading: false,
  };

  private toggleForm = () => {
    this.setState({isOpen: !this.state.isOpen});
  };

  private handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();

    this.setState({isLoading: true});
    const response = await request(`customers/${this.props.customer.id}/archive`, Method.POST);
    this.setState({isLoading: false});

    // tslint:disable-next-line switch-default
    if (response.status === Status.Success) {
      const {customer} = response.data! as {customer: Customer};
      this.props.customerStore!.removeCustomer(customer);
      Toaster.show({message: "Customer archived.", intent: Intent.SUCCESS, iconName: "tick"});
      this.setState({isOpen: false});
      history.push(ROUTES.dashboard);
    }
  };

  private renderConfirmation() {
    return (
      <Dialog isOpen={this.state.isOpen} onClose={this.toggleForm} title="Archive customer?">
        <div className="pt-dialog-body">
          This won't delete the Customer permanently, but they will no longer appear on the
          Administrator, Physician, or Pharmacist dashboards.
        </div>
        <div className="pt-dialog-footer">
          <div className="pt-dialog-footer-actions">
            <Button loading={this.state.isLoading} text="Cancel" onClick={this.toggleForm} />
            <Button
              loading={this.state.isLoading}
              intent={Intent.PRIMARY}
              onClick={this.handleSubmit}
              text="Archive customer"
            />
          </div>
        </div>
      </Dialog>
    );
  }

  public render() {
    return (
      <div className={[styles.wrapper, this.props.className].join(" ")}>
        <Button intent={Intent.DANGER} className="pt-minimal" onClick={this.toggleForm}>
          Archive customer
        </Button>

        <RiseTransitionGroup>
          {this.renderConfirmation()}
        </RiseTransitionGroup>
      </div>
    );
  }
}
