export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

type ProfileObj = { email: string, givenName: string, familyName: string};
export type GoogleResponse = {profileObj: ProfileObj, googleId: string};

export function isGoogleResponse(event: any): event is GoogleResponse {
  return (event as GoogleResponse).googleId !== undefined;
}
