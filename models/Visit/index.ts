import {computed, observable} from "mobx";
import * as moment from "moment";

import {Customer, Diagnosis, Id, Photo, Prescription, Regimen} from "models";

type Status =
  | "needs photos"
  | "needs prescription"
  | "needs payment"
  | "needs fulfillment"
  | "needs tracking"
  | "done";

type PaymentStatus = "unpaid" | "paid" | "free" | "unpaid_with_free_treatment_plan";

export class Visit {
  @observable public id: Id;
  @observable public paymentStatus: PaymentStatus;
  @observable public createdAt: moment.Moment;
  @observable public updatedAt: moment.Moment;

  @observable public photos: Photo[];
  @observable public diagnosis?: Diagnosis;
  @observable public prescription?: Prescription;
  @observable public regimen?: Regimen;

  public customer: Customer;

  constructor(fields: Partial<Visit>) {
    const {updatedAt, createdAt, photos, regimen} = fields;

    Object.assign(this, {
      ...fields,
      createdAt: moment(createdAt),
      updatedAt: moment(updatedAt),
      regimen: regimen ? Regimen.fromJS(regimen) : undefined,
      photos: (photos || []).map(photo => new Photo(photo)),
    });
  }

  @computed
  get status(): Status {
    if (this.prescription) {
      if (this.prescription.trackingNumber) return "done";
      if (this.prescription.fulfilledAt) return "needs tracking";
      if (this.alreadyPaid) return "needs fulfillment";
      return "needs payment";
    } else {
      if (
        this.customer.photos.filter(photo => !photo.visitId).length === 0 &&
        this.photos.length === 0
      ) {
        return "needs photos";
      }
      return "needs prescription";
    }
  }

  @computed
  get isFirst(): boolean {
    return this.customer.visits.length > 0 && this.id === this.customer.visits[0].id;
  }

  @computed
  get hasToBePaid(): boolean {
    return (
      this.paymentStatus === "unpaid" || this.paymentStatus === "unpaid_with_free_treatment_plan"
    );
  }

  @computed
  get alreadyPaid(): boolean {
    return this.paymentStatus === "paid" || this.paymentStatus === "free";
  }
}
