/**
 * Simple utility method to upload binary files to server
 * It provides progress feedback
 *
 * @module utilites/uploadPhotos
 */

import * as camelize from "camelize";
import {Photo} from "models";
import {identityStore} from "utilities";
import {API_ENDPOINT_PREFIX} from "../request";

enum ReadyState {
  Unsent,
  Open,
  HeadersReceived,
  Loading,
  Done,
  Cancelled
}

export interface UploadResponse {
  photos: Photo[];
}

const REQUEST_TIME_WINDOW_MS = 25000;
const UPDATE_FREQUENCY_MS = 250;
const REAL_PROGRESS_MULTIPLIER = 0.8;

/**
 * @class UploadPhotos
 */
class UploadPhotos {
  private formData: FormData;
  private requestObj: XMLHttpRequest;
  private callbacks: { [lName: string]: (this: void, e: ProgressEvent | number) => void } = {};
  private finishInterval: number;

  constructor(path: string, formData: FormData) {
    const endpointUrl = `${API_ENDPOINT_PREFIX}${path}`;

    this.formData = formData;

    this.requestObj = new XMLHttpRequest();
    this.requestObj.open("POST", endpointUrl, true);

    this.setIdentityHeaders();
  }

  public onProgress(callback: (this: void, progress: number) => void): void {
    this.callbacks.progress = callback;

    this.requestObj.upload.onprogress = evt => {
      if (evt.lengthComputable) {
        const partialProgress = evt.loaded / evt.total;

        if (partialProgress === 1) {
          let steps = 0;
          const maxSteps = REQUEST_TIME_WINDOW_MS / UPDATE_FREQUENCY_MS;
          const stepIncrement = (1 - REAL_PROGRESS_MULTIPLIER) / maxSteps;

          this.finishInterval = window.setInterval(() => {
            steps++;

            if (steps <= maxSteps) callback(REAL_PROGRESS_MULTIPLIER + (steps * stepIncrement));
          }, UPDATE_FREQUENCY_MS);
        } else {
          callback(partialProgress * REAL_PROGRESS_MULTIPLIER);
        }
      }
    };
  }

  private onError(callback: (this: void, e: ProgressEvent) => void): void {
    this.registerCallback("error", callback);
  }

  private onSuccess(callback: (this: void, response: UploadResponse) => void): void {
    this.registerCallback("load", evt => {
      const target: any = (evt.target as any);

      this.callbacks.progress(1);

      window.clearInterval(this.finishInterval);

      if (target.readyState === ReadyState.Done) {
        if (target.status >= 400) {
          return this.callbacks.error && this.callbacks.error(evt);
        }

        try {
          const response: UploadResponse = JSON.parse((evt.target as any).response);

          // The API sends dashed keys, so we need to camelize them here.
          callback(camelize(response));
        } catch (err) {
          console.error(err);

          this.callbacks.error(evt);
        }
      }
    });
  }

  private registerCallback(
    eventName: string,
    callback: (this: void, e: ProgressEvent) => void
  ) {
    if (this.callbacks[eventName]) return;

    this.callbacks[eventName] = callback;
    this.requestObj.addEventListener(eventName, callback);
  }

  private setIdentityHeaders(): void {
    if (!identityStore.isSignedIn && identityStore.token) {
      throw new Error("Can`t upload an image without sign in");
    }

    const idHeaders: { [name: string]: string } = {
      "access-token": identityStore.token!.accessToken,
      client: identityStore.token!.client,
      expiry: identityStore.token!.expiry,
      "token-type": identityStore.token!.tokenType,
      uid: identityStore.token!.uid,
    };

    for (const header in idHeaders) {
      if (idHeaders.hasOwnProperty(header)) {
        this.requestObj.setRequestHeader(header, idHeaders[header]);
      }
    }
  }

  public async start(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.onSuccess(resolve);
      this.onError(reject);

      this.requestObj.send(this.formData);
    });
  }
}

/**
 * Factory function for upload class instances
 */
export function uploadPhotos(path: string, formData: FormData): UploadPhotos {
  return new UploadPhotos(path, formData);
}
