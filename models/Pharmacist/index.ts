import {computed, observable} from "mobx";

import {Id} from "models";

export class Pharmacist {
  @observable public id: Id;
  @observable public firstName: string;
  @observable public lastName: string;
  @observable public email: string;

  public static fromJS(fields: Partial<Pharmacist>) {
    return new this(fields);
  }

  constructor(fields: Partial<Pharmacist>) {
    Object.assign(this, fields);
  }

  @computed
  get name() {
    return `${this.firstName} ${this.lastName}`;
  }
}
