import {RequestError} from "errors";
import {Method, request as plainRequest, Status, SuccessResponse} from "utilities/request";

export {Method} from "utilities/request";

export async function request(
  path: string,
  method: Method = Method.GET,
  data?: object,
  preserveData: boolean = false
): Promise<SuccessResponse> {
  const response = await plainRequest(path, method, data, preserveData);

  if (response.status === Status.Error) {
    throw new RequestError(response);
  }

  return response as SuccessResponse;
}
