import {computed, observable} from "mobx";
import * as moment from "moment";

import {Audit, Customer, MedicalProfile, MessageGroup, PhotoGroup, Physician, Visit} from "models";

export type StoryInitiator = Customer | Physician;
export type StoryObject = MessageGroup | PhotoGroup | Audit<MedicalProfile> | Visit;

export enum StoryType {
  MessageGroup = "message-group",
  PhotoGroup = "photo-group",
  MedicalProfileAudit = "medical-profile-audit",
  Visit = "visit",
}

export interface StoryParams {
  type: StoryType;
  by: StoryInitiator;
  at: moment.Moment;
  object: StoryObject;
}

export class Story {
  @observable public type: StoryType;
  @observable public by: StoryInitiator;
  @observable public at: moment.Moment;
  @observable public object: StoryObject;

  constructor(fields: StoryParams) {
    Object.assign(this, fields);
  }

  @computed
  get byCustomer(): boolean {
    return this.by instanceof Customer;
  }

  @computed
  get byPhyisican(): boolean {
    return !this.byCustomer;
  }
}
