import * as classnames from "classnames";
import {action, observable} from "mobx";
import {inject, observer} from "mobx-react";
import * as React from "react";
import FacebookLogin from "react-facebook-login";
import GoogleLogin from "react-google-login";
import {RouteComponentProps} from "react-router-dom";

import {SignLayout} from "components/app/SignLayout";
import {HeaderType} from "components/app/UnauthorizedHeader";
import {FormInput} from "components/common";
import {WelcomeDialog} from "components/customers";
import {Identity, Token} from "models";
import {CustomerStore, IdentityStore} from "stores";

import {ReactComponent as FacebookIcon} from "assets/icons/facebook.svg";
import {ReactComponent as GoogleIcon} from "assets/icons/google.svg";

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

import * as styles from "components/app/SignLayout/index.css";
import * as buttonStyles from "styles/buttons.css";

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

  private handleFormSubmit = (event: React.FormEvent<any>) => {
    event.preventDefault();
    this.submitCustomer(event);
  };

  private renderForm() {
    return (
      <form className={styles.form} onSubmit={this.handleFormSubmit}>
        <div className={styles.formHeading}>
          <h2 className={styles.formHeadingTitle}>Welcome</h2>
          <p className={styles.formHeadingLead}>
            Tell us&nbsp;a&nbsp;little about your skincare goals. It&nbsp;will take two minutes for
            you to&nbsp;get on&nbsp;your way to&nbsp;great, carefree skin!
          </p>
        </div>

        <div className={styles.formInputGroup}>
          <FormInput
            className={styles.formInput}
            type="text"
            placeholder="First name"
            disabled={this.isLoading}
            onChange={event => this.handleFieldChange("firstName", event.target.value)}
            value={this.firstName}
          />

          <FormInput
            className={styles.formInput}
            type="text"
            placeholder="Last name"
            disabled={this.isLoading}
            onChange={event => this.handleFieldChange("lastName", event.target.value)}
            value={this.lastName}
          />

          <FormInput
            className={styles.formInput}
            type="email"
            placeholder="Email"
            disabled={this.isLoading}
            onChange={event => this.handleFieldChange("email", event.target.value)}
            value={this.email}
          />

          <FormInput
            className={styles.formInput}
            type="password"
            placeholder="Password"
            disabled={this.isLoading}
            onChange={event => this.handleFieldChange("password", event.target.value)}
            value={this.password}
          />
        </div>

        <button className={classnames(buttonStyles.primary, buttonStyles.block)} type="submit">
          Create an account
        </button>

        <div className={styles.formSocialGroup}>
          <div className={styles.formSocialButton}>
            <FacebookLogin
              disableMobileRedirect={true}
              appId={FACEBOOK_APP_ID}
              autoLoad={false}
              fields=""
              callback={this.submitCustomer as any}
              size="small"
              textButton={"Using Facebook"}
              icon={<FacebookIcon />}
              cssClass={classnames(buttonStyles.facebook, buttonStyles.block)}
            />
          </div>

          <div className={styles.formSocialButton}>
            <GoogleLogin
              clientId={GOOGLE_CLIENT_ID}
              onSuccess={this.submitCustomer as any}
              onFailure={this.submitCustomer as any}
              className={classnames(buttonStyles.google, buttonStyles.block)}
            >
              <GoogleIcon /> Using Google
            </GoogleLogin>
          </div>
        </div>
      </form>
    );
  }

  public render() {
    return (
      <SignLayout
        headerType={HeaderType.SignIn}
        errors={this.errorMessage ? this.errorMessage.split("; ") : undefined}
        isLoading={this.isLoading}
      >
        {this.renderForm()}

        {/* TODO: Needs to rework */}
        <WelcomeDialog isOpen={this.isWelcomeDialogOpen} onClose={this.closeWelcomeDialog} />
      </SignLayout>
    );
  }
}
