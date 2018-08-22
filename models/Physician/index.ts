import {Id} from "models";

export interface Physician {
  id: Id;
  firstName: string;
  lastName: string;
  email: string;
  signatureImageUrl: string;
}
