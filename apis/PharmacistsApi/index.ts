import {Method, request} from "lib";
import {Pharmacist} from "models";

export namespace PharmacistsApi {
  export interface PharmacistFields {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }

  export const fetchPharmacists = async (): Promise<Pharmacist[]> => {
    const response = await request("pharmacists", Method.GET);
    return instantiatePharmacists(response.data.pharmacists);
  };

  export const createPharmacist = async (fields: PharmacistFields): Promise<Pharmacist> => {
    const response = await request("pharmacists/create", Method.POST, fields);
    return instantiatePharmacist(response.data.pharmacist);
  };

  function instantiatePharmacists(pharmacistsParams: any[]): Pharmacist[] {
    return pharmacistsParams.map(params => instantiatePharmacist(params));
  }

  function instantiatePharmacist(pharmacistParams: any): Pharmacist {
    return Pharmacist.fromJS(pharmacistParams);
  }
}
