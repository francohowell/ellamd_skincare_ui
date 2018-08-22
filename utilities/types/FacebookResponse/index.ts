// TODO: This is a test Facebook app ID, and should be replaced.
export const FACEBOOK_APP_ID = "717734908421626";

export type FacebookResponse = {id: string; accessToken: string};

export function isFacebookResponse(event: any): event is FacebookResponse {
  return (event as FacebookResponse).accessToken !== undefined;
}
