import {Button, Checkbox, Dialog, Intent} from "@blueprintjs/core";
import {inject, observer} from "mobx-react";
import * as React from "react";

import {FadeTransitionGroup, RiseTransitionGroup} from "components/common";
import {Customer} from "models";
import {CustomerStore} from "stores";
import {Method, request, Status, SubmitEvent, Toaster} from "utilities";

import * as styles from "./index.css";

interface Props {
  className?: string;
  customerStore?: CustomerStore;
}
interface State {
  isOpen: boolean;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  showPassword: boolean;
  hasError: boolean;
  errorMessage?: string;
  isLoading: boolean;
}

@inject("customerStore")
@observer
export class CreateCustomerForm extends React.Component<Props, State> {
  public state: State = {
    isOpen: false,
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    showPassword: true,
    hasError: false,
    errorMessage: undefined,
    isLoading: false,
  };

  private toggleForm = () => {
    this.setState({isOpen: !this.state.isOpen});
  };

  private handleFirstNameChange = (event: React.FormEvent<HTMLInputElement>) => {
    this.setState({firstName: (event.target as any).value, hasError: false});
  };

  private handleLastNameChange = (event: React.FormEvent<HTMLInputElement>) => {
    this.setState({lastName: (event.target as any).value, hasError: false});
  };

  private handleEmailChange = (event: React.FormEvent<HTMLInputElement>) => {
    this.setState({email: (event.target as any).value, hasError: false});
  };

  private handlePasswordChange = (event: React.FormEvent<HTMLInputElement>) => {
    this.setState({password: (event.target as any).value, hasError: false});
  };

  private setShowPassword = (event: React.FormEvent<HTMLInputElement>) => {
    this.setState({showPassword: (event.target as any).checked});
  };

  private generatePassword = () => {
    this.setState({
      showPassword: true,
      password: (Math.random().toString(36) + "00000000000000000").slice(2, 10),
    });
  };

  private handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();
    const {firstName, lastName, email, password} = this.state;

    this.setState({isLoading: true, hasError: false});
    const response = await request("customers/create", Method.POST, {
      firstName,
      lastName,
      email,
      password,
    });
    this.setState({isLoading: false});

    // tslint:disable-next-line switch-default
    switch (response.status) {
      case Status.Success:
        const {customer} = response.data! as {customer: Customer};
        this.props.customerStore!.addCustomer(customer);
        Toaster.show({message: "Customer created.", intent: Intent.SUCCESS, iconName: "tick"});
        this.setState({firstName: "", lastName: "", email: "", password: "", isOpen: false});
        break;

      case Status.Error:
        this.setState({hasError: true, errorMessage: response.error});
        break;
    }
  };

  private renderError() {
    if (!this.state.hasError) {
      return;
    }

    return (
      <div className={styles.errorWrapper}>
        <div className="pt-callout pt-intent-danger">
          {this.state.errorMessage}
        </div>
      </div>
    );
  }

  private renderForm() {
    return (
      <Dialog isOpen={this.state.isOpen} onClose={this.toggleForm} title="New customer">
        <form onSubmit={this.handleSubmit}>
          <div className="pt-dialog-body">
            <div className={styles.columns}>
              <label className="pt-label">
                First name
                <input
                  className="pt-input pt-fill"
                  type="text"
                  onChange={this.handleFirstNameChange}
                  value={this.state.firstName}
                />
              </label>

              <label className="pt-label">
                Last name
                <input
                  className="pt-input pt-fill"
                  type="text"
                  onChange={this.handleLastNameChange}
                  value={this.state.lastName}
                />
              </label>
            </div>

            <label className="pt-label">
              Email
              <input
                className="pt-input pt-fill"
                type="text"
                onChange={this.handleEmailChange}
                value={this.state.email}
              />
            </label>

            <label className="pt-label">
              Password
              <input
                className="pt-input pt-fill"
                type={this.state.showPassword ? "text" : "password"}
                onChange={this.handlePasswordChange}
                value={this.state.password}
              />
              <span className={styles.options}>
                <Checkbox
                  onChange={this.setShowPassword}
                  label="Show?"
                  checked={this.state.showPassword}
                  className="pt-inline"
                />
                <a onClick={this.generatePassword}>Generate</a>
              </span>
            </label>

            <FadeTransitionGroup>
              {this.renderError()}
            </FadeTransitionGroup>
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
                Create customer
              </Button>
            </div>
          </div>
        </form>
      </Dialog>
    );
  }

  public render() {
    return (
      <div className={[styles.wrapper, this.props.className].join(" ")}>
        <Button className="pt-large pt-intent-primary" onClick={this.toggleForm}>
          Create customer
        </Button>

        <RiseTransitionGroup>
          {this.renderForm()}
        </RiseTransitionGroup>
      </div>
    );
  }
}
