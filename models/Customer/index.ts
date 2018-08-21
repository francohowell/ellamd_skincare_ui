import {action, computed, observable, toJS} from "mobx";
import * as moment from "moment";

import {
  Diagnosis,
  Id,
  Identity,
  MedicalProfile,
  Physician,
  Prescription,
  Regimen,
  Subscription,
} from "models";
import {Message} from "../Message";
import {Photo} from "../Photo";
import {Visit} from "../Visit";

export const CUSTOMER_FIELD_LABELS: {[field in keyof Customer]?: string} = {
  firstName: "First name",
  lastName: "Last name",
  email: "Email",
  addressLine1: "Address, line 1",
  addressLine2: "Address, line 2",
  zipCode: "ZIP code",
  state: "State",
  city: "City",
  phone: "Phone",
};

export class Customer {
  @observable public id: Id;
  @observable public physicianId: Id;

  @observable public firstName: string;
  @observable public lastName: string;
  @observable public email: string;
  @observable public lastOnboardingStep: number;
  @observable public addressLine1?: string;
  @observable public addressLine2?: string;
  @observable public zipCode?: string;
  @observable public state?: string;
  @observable public city?: string;
  @observable public phone?: string;

  @observable public createdAt: string;
  @observable public onboardingCompletedAt?: moment.Moment;
  @observable public updatedAt: string;

  @observable public identity: Identity;
  @observable public subscription: Subscription;
  @observable public medicalProfile: MedicalProfile;
  @observable public actualRegimen: Regimen;
  @observable public physician: Physician;
  @observable public photos: Photo[];
  @observable public visits: Visit[];
  @observable public messages: Message[];

  public static fromJS(fields: Partial<Customer>): Customer {
    return new this(fields);
  }

  constructor(fields: Partial<Customer>) {
    const {
      actualRegimen,
      medicalProfile,
      onboardingCompletedAt,
      photos,
      subscription,
      visits,
    } = fields;

    Object.assign(this, {
      ...fields,
      subscription: subscription ? new Subscription(subscription) : undefined,
      medicalProfile: medicalProfile ? new MedicalProfile(medicalProfile) : undefined,
      actualRegimen: actualRegimen ? Regimen.fromJS(actualRegimen) : undefined,
      onboardingCompletedAt: onboardingCompletedAt ? moment(onboardingCompletedAt) : undefined,
      visits: [],
    });

    this.photos = (photos || []).map(photoParams => {
      return new Photo(photoParams);
    });

    this.visits = (visits || []).map(visit => new Visit({...visit, customer: toJS(this)}));
  }

  @computed
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  @computed
  get isOnboarded(): boolean {
    return this.onboardingCompletedAt !== undefined;
  }

  @computed
  get hasPhotos(): boolean {
    return this.photosCount > 0;
  }

  @computed
  get photosCount(): number {
    return this.photos.length;
  }

  @computed
  get diagnoses(): Diagnosis[] {
    return (
      (this.visits.filter(visit => visit.diagnosis).map(visit => visit.diagnosis) as Diagnosis[]) ||
      []
    );
  }

  @computed
  get prescriptions(): Prescription[] {
    return (
      (this.visits
        .filter(visit => visit.prescription)
        .map(visit => visit.prescription) as Prescription[]) || []
    );
  }

  @computed
  get createdAtMoment(): moment.Moment {
    return moment(this.createdAt);
  }

  @action
  public setField(field: keyof Customer, value: any) {
    Object.assign(this, {[field]: value});
  }

  @action
  public addPhotos(photos: Photo[]) {
    photos.forEach(newPhoto => {
      this.photos.push(new Photo(newPhoto));
    });
  }

  @action
  public updateVisit(visit: Visit) {
    for (let i = 0; i < this.visits.length; i++) {
      if (this.visits[i].id === visit.id) {
        this.visits[i] = new Visit({...visit, customer: toJS(this)});
        return;
      }
    }
  }

  @action
  public updatePhotos(newPhotos: Photo[]) {
    newPhotos.forEach(newPhoto => {
      for (let j = 0; j < this.photos.length; j++) {
        if (this.photos[j].id === newPhoto.id) this.photos[j] = new Photo(newPhoto);
      }
    });
  }

  @action
  public deleteVisit(deletedVisit: Visit) {
    this.visits = this.visits.filter(visit => visit.id !== deletedVisit.id);
  }
}
