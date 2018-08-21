import {Button, Spinner} from "@blueprintjs/core";
import {action, observable} from "mobx";
import {inject, observer} from "mobx-react";
import * as React from "react";
import FacebookLogin from "react-facebook-login";
import GoogleLogin from "react-google-login";
import {RouteComponentProps} from "react-router-dom";

import {FadeTransitionGroup} from "components/common";
import {WelcomeDialog} from "components/customers";
import {Identity, Token} from "models";
import {CustomerStore, IdentityStore} from "stores";

import {
  FACEBOOK_APP_ID,
  FacebookResponse,
  GOOGLE_CLIENT_ID,
  isFacebookResponse,
  isGoogleResponse,
  Method,
  request,
  Status,
} from "utilities";

import * as styles from "./index.css";

interface Props extends RouteComponentProps<any> {
  className?: string;
  identityStore?: IdentityStore;
  customerStore?: CustomerStore;
}

/**
 * The SignUpForm is the form that allows Customer creation.
 */
@inject("identityStore", "customerStore")
@observer
export class SignUpForm extends React.Component<Props> {
  @observable private firstName = "";
  @observable private lastName = "";
  @observable private email = "";
  @observable private password = "";
  @observable private isLoading = false;
  @observable private errorMessage: string | undefined = undefined;
  @observable private isWelcomeDialogOpen = false;

  public componentDidMount() {
    // HACK: We're checking here for the `code` query parameter, which Facebook sets when we're
    //   coming back from the OAuth flow. There should be a much cleaner way to set `isLoading` in
    //   that scenario.
    if (/[?&]code=/.test(window.location.search)) {
      this.setIsLoading(true);
    }
  }

  @action
  private closeWelcomeDialog = () => {
    this.isWelcomeDialogOpen = false;
  };

  @action
  private setErrorMessage = (errorMessage: string) => {
    this.errorMessage = errorMessage;
  };

  @action
  private setIsLoading = (isLoading: boolean) => {
    this.isLoading = isLoading;
  };

  @action
  private handleFieldChange = (
    field: "firstName" | "lastName" | "email" | "password",
    value: string
  ) => {
    this[field] = value;
  };

  @action
  private submitCustomer = async (event: React.FormEvent<any> | FacebookResponse) => {
    this.setIsLoading(true);
    this.errorMessage = undefined;

    let params;

    if (isGoogleResponse(event)) {
      params = {
        provider: "google",
        uid: event.googleId,
        email: event.profileObj.email,
        firstName: event.profileObj.givenName,
        lastName: event.profileObj.familyName,
      };
    } else if (isFacebookResponse(event)) {
      if (!event.accessToken) {
        this.setIsLoading(false);
        return;
      }

      params = {
        provider: "facebook",
        facebookId: event.id,
        facebookAccessToken: event.accessToken,
      };
    } else {
      params = {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        password: this.password,
      };
    }

    const response = await request("customers/create", Method.POST, params);
    this.setIsLoading(false);

    // tslint:disable-next-line switch-default
    switch (response.status) {
      case Status.Success:
        const {
          identity,
          meta: {token},
        } = response.data! as {
          identity: Identity;
          meta: {token: Token};
        };

        const identityStore = this.props.identityStore!;
        identityStore.setCurrentIdentity(identity);
        identityStore.signIn(token, false);
        break;

      case Status.Error:
        this.setErrorMessage(response.error);
        break;
    }
  };

  private renderError() {
    if (!this.errorMessage) return;

    return (
      <div className={styles.errorWrapper}>
        {this.errorMessage
          .split("; ")
          .map(message => (
            <div className="pt-callout pt-intent-danger pt-icon-cross">{message}</div>
          ))}
      </div>
    );
  }

  private renderForm() {
    return (
      <div>
        <div className={styles.columns}>
          <label className="pt-label">
            First name
            <input
              className="pt-input pt-fill pt-large"
              type="text"
              disabled={this.isLoading}
              onChange={event => this.handleFieldChange("firstName", event.target.value)}
              value={this.firstName}
            />
          </label>

          <label className="pt-label">
            Last name
            <input
              className="pt-input pt-fill pt-large"
              type="text"
              disabled={this.isLoading}
              onChange={event => this.handleFieldChange("lastName", event.target.value)}
              value={this.lastName}
            />
          </label>
        </div>

        <label className="pt-label">
          Email
          <input
            className="pt-input pt-fill pt-large"
            type="email"
            disabled={this.isLoading}
            onChange={event => this.handleFieldChange("email", event.target.value)}
            value={this.email}
          />
        </label>

        <label className="pt-label">
          Password
          <input
            className="pt-input pt-fill pt-large"
            type="password"
            disabled={this.isLoading}
            onChange={event => this.handleFieldChange("password", event.target.value)}
            value={this.password}
          />
        </label>
      </div>
    );
  }

  private renderLoadingOverlay() {
    if (!this.isLoading) {
      return;
    }

    return (
      <div className={styles.overlay}>
        <div className={styles.spinner}>
          <Spinner />
        </div>
      </div>
    );
  }

  public render() {
    return (
      <form
        className={styles.signUpForm}
        onSubmit={event => {
          event.preventDefault();
          this.submitCustomer(event);
        }}
      >
        <WelcomeDialog isOpen={this.isWelcomeDialogOpen} onClose={this.closeWelcomeDialog} />

        <h2 className={styles.heading}>Welcome</h2>
        <p className={styles.description}>
          Tell us a little about your skincare goals. It will take two minutes for you to get on
          your way to great, carefree skin!
        </p>

        {this.renderForm()}

        <FadeTransitionGroup>{this.renderError()}</FadeTransitionGroup>

        <div className={styles.actions}>
          <Button
            className={["pt-intent-primary", "pt-large", styles.submit].join(" ")}
            loading={this.isLoading}
            rightIconName="arrow-right"
            onClick={this.submitCustomer}
            type="submit"
          >
            Next
          </Button>

          <div className={styles.socialActions}>
            <FacebookLogin
              disableMobileRedirect={true}
              appId={FACEBOOK_APP_ID}
              autoLoad={false}
              fields=""
              callback={this.submitCustomer as any}
              size="small"
              textButton={this.isLoading ? "" : "Sign up with Facebook"}
              icon={this.isLoading ? <Spinner className="pt-small" /> : undefined}
              cssClass={["pt-button", "pt-large", styles.facebookButton].join(" ")}
            />

            <GoogleLogin
              clientId={GOOGLE_CLIENT_ID}
              onSuccess={this.submitCustomer as any}
              onFailure={this.submitCustomer as any}
              buttonText={this.isLoading ? "" : "Sign up with Google"}
              className={["pt-button", "pt-large", styles.googleButton].join(" ")}
            />
          </div>
        </div>

        <FadeTransitionGroup>{this.renderLoadingOverlay()}</FadeTransitionGroup>
      </form>
    );
  }
}
