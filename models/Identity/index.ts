import {Id} from "models";

export type UserType = "Customer" | "Physician" | "Pharmacist" | "Administrator";

export interface Token {
  accessToken: string;
  tokenType: string;
  client: string;
  uid: string;
  expiry: string;
}

export interface Identity {
  id: Id;
  firstName: string;
  lastName: string;
  email: string;
  userType: UserType;
  user: any;
}
