import {action, computed, observable} from "mobx";
import {createTransformer} from "mobx-utils";
import * as moment from "moment";

import {Id, Product, RegimenProduct, RegimenProductPeriod} from "models";

export class Regimen {
  @observable public id?: Id;
  @observable public customerId?: Id;
  @observable public physicianId?: Id;
  @observable public visitId?: Id;
  @observable public createdAt?: moment.Moment;
  @observable public updatedAt?: moment.Moment;

  @observable public regimenProducts: RegimenProduct[];

  public static fromJS(fields: Partial<Regimen>): Regimen {
    const {createdAt, regimenProducts, updatedAt} = fields;

    return new this({
      ...fields,
      createdAt: moment(createdAt!),
      updatedAt: moment(updatedAt!),
      regimenProducts: regimenProducts!.map(regimenProductFields => {
        return RegimenProduct.fromJS(regimenProductFields);
      }),
    });
  }

  constructor(fields: Partial<Regimen>) {
    this.setFields(fields);
    this.regimenProducts = this.regimenProducts || [];
  }

  @computed
  get isPersisted(): boolean {
    return !!this.id;
  }

  public periodRegimenProducts = createTransformer(
    (period: RegimenProductPeriod): RegimenProduct[] => {
      return this.sortedRegimenProducts.filter(p => p.period === period);
    }
  );

  @computed
  get sortedRegimenProducts(): RegimenProduct[] {
    return this.regimenProducts.slice().sort((a, b) => a.position - b.position);
  }

  @action
  public addProduct(period: RegimenProductPeriod, product: Product): void {
    const newRegimenProduct = new RegimenProduct({
      period,
      product,
      position: this.periodRegimenProducts(period).length,
    });

    this.regimenProducts.push(newRegimenProduct);
  }

  @action
  public repositionRegimenProduct(
    period: RegimenProductPeriod,
    oldIndex: number,
    newIndex: number
  ): void {
    const regimenProducts = this.periodRegimenProducts(period);
    const repositionedRegimenProduct = regimenProducts[oldIndex];

    if (newIndex === oldIndex) {
      return;
    }

    regimenProducts.splice(oldIndex, 1);
    regimenProducts.splice(newIndex, 0, repositionedRegimenProduct);
    regimenProducts.forEach((regimenProduct, index) => (regimenProduct.position = index));
  }

  @action
  public removeRegimenProduct(regimenProduct: RegimenProduct): void {
    const regimenProductIndex = this.regimenProducts.indexOf(regimenProduct);

    if (regimenProductIndex > -1) {
      this.regimenProducts.splice(regimenProductIndex, 1);
    }
  }

  @action
  public setFields(fields: Partial<Regimen>) {
    Object.assign(this, fields);
  }
}
