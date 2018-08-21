import {Method, request} from "lib";
import {Prescription} from "models";

export interface PaginatedPrescriptions {
  prescriptions: Prescription[];
  currentPage: number;
  totalPages: number;
}

export namespace PrescriptionsApi {
  export const fetchPrescriptions = async ({
    filter,
    page,
    sortColumn,
    sortAscending,
  }: {
    filter: string;
    page: number;
    sortColumn: string;
    sortAscending: boolean;
  }): Promise<PaginatedPrescriptions> => {
    const response = await request(
      `prescriptions?filter=${filter}&page=${page}&sort-column=${sortColumn}&sort-ascending=${sortAscending}`,
      Method.GET
    );

    return {
      prescriptions: instantiatePrescriptions(response.data.prescriptions),
      currentPage: response.data.meta.currentPage,
      totalPages: response.data.meta.totalPages,
    };
  };

  export const addTrackingNumber = async (
    prescription: Prescription,
    trackingNumber: string
  ): Promise<void> => {
    const response = await request(`prescriptions/${prescription.id}/add-tracking`, Method.POST, {
      trackingNumber,
    });
    const newPrescription = instantiatePrescription(response.data.prescription);
    prescription.setFields(newPrescription);
  };

  function instantiatePrescriptions(prescriptionsParams: any[]): Prescription[] {
    return prescriptionsParams.map(instantiatePrescription);
  }

  function instantiatePrescription(prescriptionParams: any): Prescription {
    return Prescription.fromJS(prescriptionParams);
  }
}
