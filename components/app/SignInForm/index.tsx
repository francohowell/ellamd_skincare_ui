import * as classnames from "classnames";
import {action, observable} from "mobx";
import {inject, observer} from "mobx-react";
import {asyncAction} from "mobx-utils";
import * as React from "react";
import FacebookLogin from "react-facebook-login";
import GoogleLogin from "react-google-login";
import {Link, RouteComponentProps} from "react-router-dom";

import {IdentitiesApi} from "apis";
import {SignLayout} from "components/app/SignLayout";
import {HeaderType} from "components/app/UnauthorizedHeader";
import {FormInput} from "components/common";
import {IdentityStore} from "stores";

import {FACEBOOK_APP_ID, FacebookResponse, GOOGLE_CLIENT_ID, ROUTES} from "utilities";

import {ReactComponent as FacebookIcon} from "assets/icons/facebook.svg";
import {ReactComponent as GoogleIcon} from "assets/icons/google.svg";

import * as styles from "components/app/SignLayout/index.css";
import * as buttonStyles from "styles/buttons.css";

interface Props extends RouteComponentProps<any> {
  identityStore?: IdentityStore;
}

class Store {
  private identityStore: IdentityStore;

  @observable public email: string;
  @observable public password: string;
  @observable public isLoading: boolean;
  @observable public hasError: boolean;

  constructor(props: Props) {
    this.identityStore = props.identityStore!;

    this.email = "";
    this.password = "";
    this.hasError = false;
    this.isLoading = false;
  }

  @asyncAction
  public *signInWithEmail() {
    yield this.signIn({
      provider: "email",
      email: this.email,
      password: this.password,
    });
  }

  @asyncAction
  public *signInWithGoogle(event: any) {
    yield this.signIn({
      provider: "google",
      uid: event.googleId,
      email: event.profileObj.email,
      firstName: event.profileObj.givenName,
      lastName: event.profileObj.familyName,
    });
  }

  @asyncAction
  public *signInWithFacebook(event: FacebookResponse) {
    yield this.signIn({
      provider: "facebook",
      facebookId: event.id,
      facebookAccessToken: event.accessToken,
    });
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
  public setIsLoading(isLoading: boolean): void {
    this.isLoading = isLoading;
  }

  @asyncAction
  private *signIn(
    signInOptions: IdentitiesApi.SignInOptions
  ): IterableIterator<Promise<IdentitiesApi.SignInResponse>> {
    this.isLoading = true;
    this.hasError = false;

    try {
      const {identity, token} = yield IdentitiesApi.signIn(signInOptions);

      this.identityStore.setCurrentIdentity(identity);
      this.identityStore.signIn(token);
    } catch (error) {
      this.hasError = true;
    } finally {
      this.isLoading = false;
    }
  }
}

/**
 * The SignInForm is the main sign-in form for the app.
 *
 * TODO: We're currently handling the server communication in this component, but it almost
 *   certainly belongs in the IdentityStore.
 */
@inject("identityStore")
@observer
export class SignInForm extends React.Component<Props> {
  private store: Store;

  constructor(props: Props) {
    super(props);
    this.store = new Store(props);
  }

  public componentDidMount() {
    // HACK: We're checking here for the `code` query parameter, which Facebook sets when we're
    //   coming back from the OAuth flow. There should be a much cleaner way to set `isLoading` in
    //   that scenario.
    if (/[?&]code=/.test(window.location.search)) {
      this.store.setIsLoading(true);
    }
  }

  private handleFormSubmit = (event: React.FormEvent<any>) => {
    event.preventDefault();
    this.store.signInWithEmail();
  };

  private renderForm() {
    return (
      <form className={styles.form} onSubmit={this.handleFormSubmit}>
        <div className={styles.formHeading}>
          <h2 className={styles.formHeadingTitle}>Welcome back</h2>
          <p className={styles.formHeadingLead}>Sign in to access your personal dashboard.</p>
        </div>

        <div className={styles.formInputGroup}>
          <FormInput
            className={styles.formInput}
            type="email"
            placeholder="Email address"
            disabled={this.store.isLoading}
            onChange={event => this.store.setEmail((event.target as any).value)}
            value={this.store.email}
          />

          <FormInput
            className={styles.formInput}
            type="password"
            placeholder="Password"
            disabled={this.store.isLoading}
            onChange={event => this.store.setPassword((event.target as any).value)}
            value={this.store.password}
          />
        </div>

        <button className={classnames(buttonStyles.primary, buttonStyles.block)} type="submit">
          Sign in
        </button>

        <Link
          to={ROUTES.forgotPassword}
          className={classnames(buttonStyles.simple, buttonStyles.block)}
        >
          Forgot your password?
        </Link>

        <div className={styles.formSocialGroup}>
          <div className={styles.formSocialButton}>
            <FacebookLogin
              disableMobileRedirect={true}
              appId={FACEBOOK_APP_ID}
              autoLoad={false}
              fields=""
              callback={(event: any) => {
                this.store.signInWithFacebook(event);
              }}
              size="small"
              textButton={"Using Facebook"}
              icon={<FacebookIcon />}
              cssClass={classnames(buttonStyles.facebook, buttonStyles.block)}
            />
          </div>

          <div className={styles.formSocialButton}>
            <GoogleLogin
              clientId={GOOGLE_CLIENT_ID}
              onSuccess={event => this.store.signInWithGoogle(event)}
              onFailure={event => this.store.signInWithGoogle(event)}
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
        headerType={HeaderType.SignUp}
        isLoading={this.store.isLoading}
        errors={
          this.store.hasError
            ? ["That email address and password combination is incorrect."]
            : undefined
        }
      >
        {this.renderForm()}
      </SignLayout>
    );
  }
}
