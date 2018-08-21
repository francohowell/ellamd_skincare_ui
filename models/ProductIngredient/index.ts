import {action, observable} from "mobx";
import * as moment from "moment";

import {Id} from "models";

export class ProductIngredient {
  @observable public id: Id;
  @observable public name: string;
  @observable public isKey: boolean;

  @observable public createdAt: moment.Moment;
  @observable public updatedAt: moment.Moment;

  public static fromJS(fields: Partial<ProductIngredient>) {
    return new this({
      ...fields,
      createdAt: moment(fields.createdAt),
      updatedAt: moment(fields.updatedAt),
    });
  }

  constructor(fields: Partial<ProductIngredient>) {
    this.setFields(fields);
  }

  @action
  public setFields(fields: Partial<ProductIngredient>) {
    Object.assign(this, fields);
  }
}
