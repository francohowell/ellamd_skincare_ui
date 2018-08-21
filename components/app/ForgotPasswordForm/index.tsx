import {Button} from "@blueprintjs/core";
import {action, observable} from "mobx";
import {observer} from "mobx-react";
import * as React from "react";
import {RouteComponentProps} from "react-router-dom";

import {IdentitiesApi} from "apis";
import {FadeTransitionGroup} from "components/common";

import * as styles from "./index.css";

interface Props extends RouteComponentProps<any> {}

const enum SubmissionStatus {
  NotSubmitted = "not_submitted",
  Success = "success",
  Fail = "fail",
}

class Store {
  @observable public isLoading: boolean;
  @observable public email: string;
  @observable public submissionStatus: SubmissionStatus;

  constructor() {
    this.isLoading = false;
    this.email = "";
    this.submissionStatus = SubmissionStatus.NotSubmitted;
  }

  @action
  public setEmail(email: string): void {
    this.email = email;
  }

  @action
  public setIsLoading(isLoading: boolean): void {
    this.isLoading = isLoading;
  }

  @action
  public setSubmissionStatus(submissionStatus: SubmissionStatus): void {
    this.submissionStatus = submissionStatus;
  }

  @action
  public async submitEmail(): Promise<void> {
    this.isLoading = true;
    this.submissionStatus = SubmissionStatus.NotSubmitted;

    try {
      await IdentitiesApi.forgotPassword(this.email);
      this.setSubmissionStatus(SubmissionStatus.Success);
    } catch (error) {
      this.setSubmissionStatus(SubmissionStatus.Fail);
    } finally {
      this.setIsLoading(false);
    }
  }
}

/**
 * The ForgotPasswordForm allows a user to receive a password-reset email.
 */
@observer
export class ForgotPasswordForm extends React.Component<Props> {
  private store: Store;

  constructor(props: Props) {
    super(props);
    this.store = new Store();
  }

  public render() {
    return (
      <div className={styles.forgotPasswordForm}>
        <h2 className={styles.heading}>Forgot your password?</h2>
        <p className={styles.description}>Enter your email address to receive a reset link.</p>

        <label className="pt-label">
          Email address
          <input
            className="pt-input pt-fill pt-large"
            type="text"
            onChange={event => this.store.setEmail((event.target as any).value)}
            value={this.store.email}
          />
        </label>

        <FadeTransitionGroup>{this.renderMessage()}</FadeTransitionGroup>

        <Button
          onClick={() => this.store.submitEmail()}
          className={`pt-intent-primary pt-large ${styles.submit}`}
          loading={this.store.isLoading}
        >
          Submit
        </Button>
      </div>
    );
  }

  private renderMessage() {
    if (this.store.submissionStatus === SubmissionStatus.NotSubmitted) {
      return;
    }

    const message =
      this.store.submissionStatus === SubmissionStatus.Success
        ? "If there is an account with that email address, a reset link is on its way!"
        : "Email is invalid";

    return <p className="pt-callout pt-intent-success">{message}</p>;
  }
}
