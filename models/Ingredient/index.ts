import {observable} from "mobx";

import {Id} from "models";

export class Ingredient {
  @observable public id: Id;
  @observable public name: string;
  @observable public minimumAmount: number;
  @observable public maximumAmount: number;
  @observable public unit: string;
  @observable public description: string;

  public static fromJS(fields: Partial<Ingredient>): Ingredient {
    return new this({
      ...fields,
    });
  }

  constructor(fields: Partial<Ingredient>) {
    Object.assign(this, fields);
  }
}
