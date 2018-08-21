import {Intent} from "@blueprintjs/core";
import * as camelize from "camelize";
import * as dasherize from "dasherize";
import "whatwg-fetch";

import {identityStore, Toaster} from "utilities";

export const API_ENDPOINT_PREFIX =
  typeof process !== "undefined" && process.env.API_ENDPOINT_PREFIX
    ? process.env.API_ENDPOINT_PREFIX
    : "http://localhost:3000/";

const RETRY_DELAY_IN_SECONDS = 5;

let hasShownRetryMessage = false;
let hasShownFailedMessage = false;

export interface SuccessResponse {
  headers: Headers;
  status: Status.Success;
  data?: any;
}

export interface ErrorResponse {
  headers: Headers;
  status: Status.Error;
  error: string;
}

export type ApiResponse = SuccessResponse | ErrorResponse;

interface RawSuccessResponse {
  headers: Headers;
  [dataKey: string]: object;
}

interface RawErrorResponse {
  headers: Headers;
  error: string;
}

type RawApiResponse = RawSuccessResponse | RawErrorResponse;

function isRawErrorResponse(rawApiResponse: RawApiResponse): rawApiResponse is RawErrorResponse {
  return (rawApiResponse as RawErrorResponse).error !== undefined;
}

export enum Method {
  GET = "GET",
  POST = "POST",
  PATCH = "PATCH",
}

export enum Status {
  Success,
  Error,
}

function delay(delayInMilliseconds: number) {
  return new Promise(resolve => setTimeout(resolve, delayInMilliseconds));
}

async function checkStatus(response: Response): Promise<Response> {
  if (response.ok) {
    return response;
  } else {
    throw new Error(response.statusText);
  }
}

const removeNulls = (object: any) => {
  Object.keys(object).forEach(key => {
    if (object[key] && typeof object[key] === "object") {
      removeNulls(object[key]);
      // tslint:disable-next-line no-null-keyword
    } else if (object[key] === null) {
      delete object[key];
    }
  });
  return object;
};

async function parseBody(response: Response): Promise<ApiResponse> {
  let responseBody = (await response.json()) as RawApiResponse;
  const {headers} = response;

  if (isRawErrorResponse(responseBody)) {
    return {
      error: responseBody.error,
      headers,
      status: Status.Error,
    };
  } else {
    if (responseBody !== undefined) {
      responseBody = camelize(responseBody);
      responseBody = removeNulls(responseBody);
    }

    return {
      data: responseBody,
      headers,
      status: Status.Success,
    };
  }
}

/**
 * Send a request to the API.
 */
export async function request(
  path: string,
  method: Method = Method.GET,
  data?: object,
  preserveData: boolean = false
): Promise<ApiResponse> {
  const endpoint = `${API_ENDPOINT_PREFIX}${path}`;
  let headers: any = preserveData ? {} : {"Content-Type": "application/json"};

  if (identityStore.isSignedIn && identityStore.token) {
    headers = {
      ...headers,
      "access-token": identityStore.token.accessToken,
      client: identityStore.token.client,
      expiry: identityStore.token.expiry,
      "token-type": identityStore.token.tokenType,
      uid: identityStore.token.uid,
    };
  }

  const options: RequestInit = {
    headers,
    method: Method[method],
  };

  if (data) {
    options.body = preserveData ? data as FormData : JSON.stringify(dasherize(data));
  }

  try {
    let response = await fetch(endpoint, options);
    response = await checkStatus(response);
    const apiResponse = await parseBody(response);

    return apiResponse;
  } catch (error) {
    // Retry the request once:
    if (!hasShownRetryMessage) {
      Toaster.show({
        message: "Uh oh! There’s been an issue connecting to EllaMD. We’re trying again…",
        timeout: RETRY_DELAY_IN_SECONDS * 1000,
        intent: Intent.WARNING,
        iconName: "warning-sign",
      });

      hasShownRetryMessage = true;
    }

    await delay(RETRY_DELAY_IN_SECONDS * 1000);

    // TODO: DRY this up; it's the same request code as above:
    try {
      let response = await fetch(endpoint, options);
      response = await checkStatus(response);
      const apiResponse = await parseBody(response);

      return apiResponse;
    } catch (error) {
      if (!hasShownFailedMessage) {
        if (typeof window !== "undefined") {
          Toaster.show({
            action: {onClick: () => window.location.reload(true), text: "refresh"},
            message:
              "Uh oh, an error has occurred! The EllaMD team has been notified and will investigate the issue for you. You might want to refresh the page and try again.",
            timeout: 0,
            intent: Intent.DANGER,
            iconName: "error",
          });
        }

        hasShownFailedMessage = true;
      }

      throw new Error(`Error while fetching ${path}: ${error}`);
    }
  }
}
