import {Button, Spinner} from "@blueprintjs/core";
import {action, observable} from "mobx";
import {inject, observer} from "mobx-react";
import {asyncAction} from "mobx-utils";
import * as React from "react";
import FacebookLogin from "react-facebook-login";
import GoogleLogin from "react-google-login";
import {Link, RouteComponentProps} from "react-router-dom";

import {IdentitiesApi} from "apis";
import {FadeTransitionGroup} from "components/common";
import {IdentityStore} from "stores";

import {FACEBOOK_APP_ID, FacebookResponse, GOOGLE_CLIENT_ID, ROUTES} from "utilities";

import * as styles from "./index.css";

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

  public render() {
    return (
      <form
        className={styles.signInForm}
        onSubmit={event => {
          event.preventDefault();
          this.store.signInWithEmail();
        }}
      >
        <h2 className={styles.heading}>Welcome back</h2>
        <p className={styles.description}>Sign in to access your personal dashboard.</p>

        <label className="pt-label">
          Email address
          <input
            className="pt-input pt-fill pt-large"
            type="text"
            onChange={event => this.store.setEmail((event.target as any).value)}
            value={this.store.email}
          />
        </label>

        <label className="pt-label">
          Password
          <input
            className="pt-input pt-fill pt-large"
            type="password"
            onChange={event => this.store.setPassword((event.target as any).value)}
            value={this.store.password}
          />
        </label>

        <FadeTransitionGroup>{this.renderError()}</FadeTransitionGroup>

        <Button className={`pt-intent-primary pt-large ${styles.submit}`} type="submit">
          Sign in
        </Button>

        <Link
          to={ROUTES.forgotPassword}
          className={`pt-intent-primary pt-button pt-large pt-minimal ${styles.submit}`}
        >
          Forgot your password?
        </Link>

        <div className={styles.actions}>
          <FacebookLogin
            disableMobileRedirect={true}
            appId={FACEBOOK_APP_ID}
            autoLoad={false}
            fields=""
            callback={(event: any) => {
              this.store.signInWithFacebook(event);
            }}
            size="small"
            textButton="Sign in with Facebook"
            cssClass={`pt-button pt-large ${styles.facebookButton}`}
          />

          <GoogleLogin
            clientId={GOOGLE_CLIENT_ID}
            onSuccess={event => this.store.signInWithGoogle(event)}
            onFailure={event => this.store.signInWithGoogle(event)}
            buttonText="Sign in with Google"
            className={`pt-button pt-large ${styles.googleButton}`}
          />
        </div>

        <FadeTransitionGroup>{this.renderLoadingOverlay()}</FadeTransitionGroup>
      </form>
    );
  }

  private renderError() {
    if (!this.store.hasError) {
      return;
    }

    return (
      <div className={styles.errorWrapper}>
        <div className="pt-callout pt-intent-danger">
          That email address and password combination is incorrect.
        </div>
      </div>
    );
  }

  private renderLoadingOverlay() {
    if (!this.store.isLoading) {
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
}
