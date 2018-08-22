import {action, observable} from "mobx";

import {Id, Product} from "models";

export type RegimenProductPeriod = "am" | "pm";

export class RegimenProduct {
  @observable public id?: Id;
  @observable public period: RegimenProductPeriod;
  @observable public position: number;

  @observable public product: Product;

  public static fromJS(fields: Partial<RegimenProduct>): RegimenProduct {
    const {product} = fields;

    return new this({
      ...fields,
      product: Product.fromJS(product!),
    });
  }

  constructor(fields: Partial<RegimenProduct>) {
    this.setFields(fields);
  }

  @action
  public setFields(fields: Partial<RegimenProduct>) {
    Object.assign(this, fields);
  }
}
