import {Button} from "@blueprintjs/core";
import {inject, observer} from "mobx-react";
import * as React from "react";
import {RouteComponentProps} from "react-router-dom";

import {FadeTransitionGroup} from "components/common";
import {Identity, Token} from "models";
import {IdentityStore} from "stores";
import {Method, request, Status, SubmitEvent} from "utilities";

import * as styles from "./index.css";

interface Props extends RouteComponentProps<any> {
  identityStore?: IdentityStore;
}
interface State {
  password: string;
  isLoading: boolean;
  errorMessage?: string;
}

/**
 * The ResetPasswordForm allows a user to reset their password.
 */
@inject("identityStore")
@observer
export class ResetPasswordForm extends React.Component<Props, State> {
  public state: State = {
    password: "",
    isLoading: false,
    errorMessage: undefined,
  };

  private handlePasswordChange = (event: React.FormEvent<HTMLInputElement>) => {
    this.setState({password: (event.target as any).value});
  };

  private handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();
    const {password} = this.state;

    this.setState({isLoading: true, errorMessage: undefined});

    const response = await request("identities/reset-password", Method.POST, {
      password,
      token: this.props.match.params.token,
    });

    if (response.status === Status.Success) {
      const {identityStore} = this.props;
      const {identity, meta: {token}} = response.data! as {
        identity: Identity;
        meta: {token: Token};
      };

      identityStore!.setCurrentIdentity(identity);
      identityStore!.signIn(token);
    } else {
      this.setState({isLoading: false, errorMessage: response.error});
    }
  };

  private renderMessage() {
    if (!this.state.errorMessage) return;

    return (
      <p className="pt-callout pt-intent-warning">
        {this.state.errorMessage}
      </p>
    );
  }

  public render() {
    return (
      <form className={styles.resetPasswordForm} onSubmit={this.handleSubmit}>
        <h2 className={styles.heading}>Reset your password</h2>
        <p className={styles.description}>Enter a new password below to update your account.</p>

        <label className="pt-label">
          Password
          <input
            className="pt-input pt-fill pt-large"
            type="password"
            onChange={this.handlePasswordChange}
            value={this.state.password}
          />
        </label>

        <FadeTransitionGroup>
          {this.renderMessage()}
        </FadeTransitionGroup>

        <Button
          onClick={this.handleSubmit}
          className={["pt-intent-primary", "pt-large", styles.submit].join(" ")}
          loading={this.state.isLoading}
          type="submit"
        >
          Submit
        </Button>
      </form>
    );
  }
}
