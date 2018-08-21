import {Method, request} from "lib";
import {Identity, Token} from "models";

import {ROUTES} from "utilities";

export namespace IdentitiesApi {
  interface SignInEmailOptions {
    provider: "email";
    email: string;
    password: string;
  }

  interface SignInGoogleOptions {
    provider: "google";
    uid: string;
    email: string;
    firstName: string;
    lastName: string;
  }

  interface SignInFacebookOptions {
    provider: "facebook";
    facebookId: string;
    facebookAccessToken: string;
  }

  export type SignInOptions = SignInEmailOptions | SignInGoogleOptions | SignInFacebookOptions;

  export interface SignInResponse {
    identity: Identity;
    token: Token;
  }

  export const signIn = async (signInOptions: SignInOptions): Promise<SignInResponse> => {
    let path: string;

    switch (signInOptions.provider) {
      case "email":
        path = "identities/sign-in";
        break;
      default:
        path = "customers/create";
        break;
    }

    const response = await request(path, Method.POST, signInOptions);

    return {
      identity: response.data.identity,
      token: response.data.meta.token,
    };
  };

  export const forgotPassword = async (email: string): Promise<void> => {
    await request("identities/forgot-password", Method.POST, {
      email,
      redirectUrl: new URL(ROUTES.resetPassword, window.location.href).href,
    });
  };
}
