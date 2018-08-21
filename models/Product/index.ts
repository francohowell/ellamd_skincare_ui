import {action, computed, observable} from "mobx";
import * as moment from "moment";

import {Id, ProductIngredient} from "models";

export type ProductTag = string;

export enum ProductSource {
  Custom = "custom",
  Sephora = "sephora",
  Ulta = "ulta",
  Dermstore = "dermstore",
}

export interface ProductPackage {
  sku?: string;
  price?: number;
  volume?: string;
}

export class Product {
  @observable public id?: Id;
  @observable public store: ProductSource;
  @observable public storeId?: string;

  @observable public brand: string;
  @observable public name: string;

  @observable public description?: string;
  @observable public diagnoses?: string;
  @observable public instructions?: string;

  @observable public imageUrl?: string;
  @observable public productUrl: string;

  @observable public tags?: [ProductTag];
  @observable public packages?: [ProductPackage];

  @observable public averageRating?: number;
  @observable public numberOfReviews?: number;

  @observable public isPending: boolean = false;

  @observable public createdAt?: moment.Moment;
  @observable public updatedAt?: moment.Moment;

  @observable public productIngredients: ProductIngredient[] = [];

  @observable public ingredientsString?: string;

  public static fromJS(fields: Partial<Product>): Product {
    const {createdAt, productIngredients, updatedAt} = fields;

    return new this({
      ...fields,
      createdAt: moment(createdAt!),
      updatedAt: moment(updatedAt!),
      productIngredients: productIngredients!.map(pi => ProductIngredient.fromJS(pi)),
    });
  }

  constructor(fields: Partial<Product>) {
    this.setFields({
      brand: "",
      name: "",
      productUrl: "",
      ...fields,
    });
  }

  @computed
  get isNew(): boolean {
    return !this.id;
  }

  @computed
  get nameWithBrand(): string {
    if (!!this.brand) {
      return `[${this.brand}] ${this.name}`;
    }

    return this.name;
  }

  @action
  public setFields(fields: Partial<Product>): void {
    Object.assign(this, fields);
  }
}
