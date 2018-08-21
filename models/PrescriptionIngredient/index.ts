import {observable} from "mobx";

import {Ingredient} from "models";

export class PrescriptionIngredient {
  @observable public ingredient: Ingredient;
  @observable public amount: number;

  public static fromJS(fields: Partial<PrescriptionIngredient>): PrescriptionIngredient {
    return new this({
      ...fields,
      ingredient: Ingredient.fromJS(fields.ingredient!),
    });
  }

  constructor(fields: Partial<PrescriptionIngredient>) {
    Object.assign(this, fields);
  }
}
