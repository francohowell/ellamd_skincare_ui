import {action, computed, observable} from "mobx";
import * as moment from "moment";

import {Formulation, Id, Physician, PrescriptionIngredient} from "models";

export type Fragrance = "no_scent" | "rose_hip" | "eucalyptus";
export type CreamBase = "hrt" | "anhydrous";

export const FRAGRANCE_LABELS: {[key in string]: string} = {
  no_scent: "None",
  rose_hip: "Rose Hip",
  eucalyptus: "Eucalyptus",
};

export class Prescription {
  @observable public id: Id;
  @observable public token: string;
  @observable public prescriptionIngredients: PrescriptionIngredient[];
  @observable public physician: Physician;
  @observable public signa: string;
  @observable public customerInstructions: string;
  @observable public pharmacistInstructions: string;
  @observable public pdfUrl: string;
  @observable public fulfilledAt: string;
  @observable public trackingNumber?: string;
  @observable public trackingUrl?: string;
  @observable public creamBase: CreamBase;
  @observable public fragrance: Fragrance;
  @observable public formulation?: Formulation;
  @observable public volumeInMl: number;
  @observable public shouldShowToPharmacists: boolean;

  @observable public customerFirstName: string;
  @observable public customerLastName: string;

  @observable public createdAt: moment.Moment;

  public static fromJS(fields: Partial<Prescription>) {
    return new this({
      ...fields,
      prescriptionIngredients: fields.prescriptionIngredients!.map(piFields => {
        return new PrescriptionIngredient(piFields);
      }),
      createdAt: moment(fields.createdAt!),
    });
  }

  constructor(fields: Partial<Prescription>) {
    this.setFields(fields);
  }

  @computed
  get customerName(): string {
    return `${this.customerFirstName} ${this.customerLastName}`;
  }

  @action
  public setFields(fields: Partial<Prescription>) {
    Object.assign(this, fields);
  }
}
