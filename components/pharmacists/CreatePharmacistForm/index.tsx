import {Button, Checkbox, Dialog} from "@blueprintjs/core";
import {action, observable} from "mobx";
import {inject, observer} from "mobx-react";
import {asyncAction} from "mobx-utils";
import * as React from "react";

import {PharmacistsApi} from "apis";
import {FadeTransitionGroup, RiseTransitionGroup} from "components/common";
import {notifySuccess} from "lib";
import {Pharmacist} from "models";
import {PharmacistStore} from "stores";

import * as styles from "./index.css";

interface Props {
  className?: string;
  pharmacistStore?: PharmacistStore;
}

class Store {
  private pharmacistStore: PharmacistStore;

  @observable public isOpen: boolean = false;
  @observable public isLoading: boolean = false;

  @observable public firstName: string = "";
  @observable public lastName: string = "";
  @observable public email: string = "";
  @observable public password: string = "";
  @observable public showPassword: boolean = true;

  @observable public hasError: boolean = false;
  @observable public errorMessage?: string;

  constructor(props: Props) {
    this.pharmacistStore = props.pharmacistStore!;
  }

  @action
  public toggleForm(): void {
    this.isOpen = !this.isOpen;
  }

  @action
  public generatePassword(): void {
    this.password = (Math.random().toString(36) + "00000000000000000").slice(2, 10);
    this.showPassword = true;
  }

  @action
  public setFirstName(firstName: string): void {
    this.firstName = firstName;
    this.hasError = false;
  }

  @action
  public setLastName(lastName: string): void {
    this.lastName = lastName;
    this.hasError = false;
  }

  @action
  public setEmail(email: string): void {
    this.email = email;
    this.hasError = false;
  }

  @action
  public setPassword(password: string): void {
    this.password = password;
    this.hasError = false;
  }

  @action
  public setShowPassword(showPassword: boolean): void {
    this.showPassword = showPassword;
  }

  @asyncAction
  public *submitPharmacist(): IterableIterator<Promise<Pharmacist>> {
    this.isLoading = true;
    this.hasError = false;

    try {
      const pharmacist = yield PharmacistsApi.createPharmacist({
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        password: this.password,
      });
      this.pharmacistStore.addPharmacist(pharmacist);

      this.isOpen = false;
      this.firstName = "";
      this.lastName = "";
      this.email = "";
      this.password = "";

      notifySuccess("Pharmacist created!");
    } catch (error) {
      this.hasError = true;
      this.errorMessage = error.message;
    } finally {
      this.isLoading = false;
    }
  }
}

@inject("pharmacistStore")
@observer
export class CreatePharmacistForm extends React.Component<Props> {
  private store: Store;

  constructor(props: Props) {
    super(props);
    this.store = new Store(props);
  }

  public render() {
    return (
      <div className={`${styles.wrapper} ${this.props.className}`}>
        <Button className={styles.button} onClick={() => this.store.toggleForm()}>
          Create pharmacist
        </Button>

        <RiseTransitionGroup>{this.renderForm()}</RiseTransitionGroup>
      </div>
    );
  }

  private renderForm() {
    return (
      <Dialog
        isOpen={this.store.isOpen}
        title="New pharmacist"
        onClose={() => this.store.toggleForm()}
      >
        <form
          onSubmit={event => {
            event.preventDefault();
            this.store.submitPharmacist();
          }}
        >
          <div className="pt-dialog-body">
            <div className={styles.columns}>
              <label className="pt-label">
                First name
                <input
                  className="pt-input pt-fill"
                  type="text"
                  onChange={event => this.store.setFirstName(event.target.value)}
                  value={this.store.firstName}
                />
              </label>

              <label className="pt-label">
                Last name
                <input
                  className="pt-input pt-fill"
                  type="text"
                  onChange={event => this.store.setLastName(event.target.value)}
                  value={this.store.lastName}
                />
              </label>
            </div>

            <label className="pt-label">
              Email
              <input
                className="pt-input pt-fill"
                type="text"
                onChange={event => this.store.setEmail(event.target.value)}
                value={this.store.email}
              />
            </label>

            <label className="pt-label">
              Password
              <input
                className="pt-input pt-fill"
                type={this.store.showPassword ? "text" : "password"}
                onChange={event => this.store.setPassword(event.target.value)}
                value={this.store.password}
              />
              <span className={styles.options}>
                <Checkbox
                  onChange={event => this.store.setShowPassword((event.target as any).checked)}
                  label="Show?"
                  checked={this.store.showPassword}
                  className="pt-inline"
                />
                <a onClick={() => this.store.generatePassword()}>Generate</a>
              </span>
            </label>

            <FadeTransitionGroup>{this.renderError()}</FadeTransitionGroup>
          </div>

          <div className="pt-dialog-footer">
            <div className="pt-dialog-footer-actions">
              <Button onClick={this.store.toggleForm}>Cancel</Button>

              <Button loading={this.store.isLoading} className="pt-intent-primary" type="submit">
                Create pharmacist
              </Button>
            </div>
          </div>
        </form>
      </Dialog>
    );
  }

  private renderError() {
    if (!this.store.hasError) {
      return;
    }

    return (
      <div className={styles.errorWrapper}>
        <div className="pt-callout pt-intent-danger">{this.store.errorMessage}</div>
      </div>
    );
  }
}
