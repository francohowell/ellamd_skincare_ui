import {ErrorResponse} from "utilities";

export class RequestError extends Error {
  constructor(response: ErrorResponse) {
    super(response.error);

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
