import {Intent} from "@blueprintjs/core";
import {action, computed, observable} from "mobx";

import {STEP_COUNT as ONBOARDING_STEP_COUNT} from "components/app";
import {Customer, Identity, Token} from "models";
import {Analytics, history, Method, request, ROUTES, Status} from "utilities";
import {Toaster} from "utilities/Toaster";

const TIME_TO_STAY_SIGNED_IN_IN_SECONDS = 60 * 24 * 60 * 60; // 60 days

// HACK: We do this so that we can run the app on the server (for SSR). We should appropriately
//   load the identity instead of just stubbing these methods.
interface Storage {
  getItem: (key: string) => any;
  setItem: (key: string, value: any) => void;
}
const storage: Storage =
  typeof localStorage !== "undefined"
    ? localStorage
    : {
        getItem: (_key: string) => undefined,
        setItem: (_key: string, _value: any) => undefined,
      };

export class IdentityStore {
  @observable private _token?: Token;
  @observable public isSignedIn: boolean = false;
  @observable public isLoading: boolean = false;
  @observable public currentIdentity?: Identity;
  @observable public showThankYouDialog: boolean = false;

  constructor() {
    if (this.hasValidLocalStorageData()) {
      const token: Token = {
        accessToken: storage.getItem("identity.token.access-token"),
        client: storage.getItem("identity.token.client"),
        expiry: storage.getItem("identity.token.expiry"),
        tokenType: storage.getItem("identity.token.token-type"),
        uid: storage.getItem("identity.token.uid"),
      };

      this.token = token;
      this.isSignedIn = true;
      this.isLoading = true;

      // We can't fetch the identity immediately because we need the request object to be set up:
      setTimeout(this.fetchCurrentIdentity, 250);
    }
  }

  @action
  public setShowThankYouDialog(value: boolean) {
    this.showThankYouDialog = value;
  }

  @action
  public signIn(token: Token, showToastAndRedirect: boolean = true) {
    const expirationTime = this.currentTime() + TIME_TO_STAY_SIGNED_IN_IN_SECONDS;
    storage.setItem("identity.expires-at", expirationTime.toString());

    if (this.currentIdentity && this.currentIdentity.userType === "Customer") {
      this.replaceUser(observable(new Customer(this.currentIdentity.user as any)));
    }

    this.isSignedIn = true;
    this.token = token;

    if (showToastAndRedirect) {
      if (
        this.currentIdentity &&
        this.currentIdentity.userType === "Customer" &&
        this.currentIdentity.user.lastOnboardingStep <= ONBOARDING_STEP_COUNT
      ) {
        history.push(ROUTES.onboarding);
      } else {
        history.push(ROUTES.dashboard);
      }

      Toaster.show({message: "You’ve signed in.", intent: Intent.SUCCESS, iconName: "tick"});
    }
  }

  @action
  public signOut() {
    storage.setItem("identity.expires-at", "0");

    this.isSignedIn = false;
    this.token = undefined;
    this.currentIdentity = undefined;

    history.push(ROUTES.signIn);
    Toaster.show({message: "You’ve signed out.", intent: Intent.SUCCESS, iconName: "tick"});
  }

  @action
  public setCurrentIdentity(identity: Identity) {
    this.currentIdentity = identity;

    // Send the identity to Segment.
    Analytics.identify(identity.id, {
      name: `${identity.firstName} ${identity.lastName}`,
      email: identity.email,
      type: identity.userType,
    });

    this.isLoading = false;
  }

  @computed
  get token() {
    return this._token;
  }

  set token(newToken) {
    if (newToken === undefined) {
      return;
    }

    this._token = newToken;

    storage.setItem("identity.token.access-token", newToken.accessToken);
    storage.setItem("identity.token.token-type", newToken.tokenType);
    storage.setItem("identity.token.client", newToken.client);
    storage.setItem("identity.token.uid", newToken.uid);
    storage.setItem("identity.token.expiry", newToken.expiry);
  }

  @action
  public replaceUser(user: any) {
    if (this.currentIdentity) {
      this.currentIdentity.user = user;
    }
  }

  private currentTime() {
    return new Date().getTime() / 1000;
  }

  private hasValidLocalStorageData() {
    const existingExpiresAt = storage.getItem("identity.expires-at");
    return existingExpiresAt && parseInt(existingExpiresAt, 10) > this.currentTime();
  }

  @action
  private fetchCurrentIdentity = async () => {
    const response = await request("identities/current", Method.GET);

    // tslint:disable-next-line switch-default
    switch (response.status) {
      case Status.Success:
        const {identity} = response.data! as {identity: Identity};

        if (identity.userType === "Customer") {
          identity.user = new Customer(identity.user as Customer);
        }

        this.setCurrentIdentity(identity);
        break;

      case Status.Error:
        this.signOut();
        break;
    }
  };
}
