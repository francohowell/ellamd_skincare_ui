import {computed} from "mobx";
import {createTransformer, ILazyObservable, lazyObservable} from "mobx-utils";

import {Method, request} from "lib";
import {Id, Ingredient} from "models";

export class IngredientStore {
  private _ingredientsSink: (newValue: Ingredient[]) => void;
  private _ingredients: ILazyObservable<Ingredient[]>;

  constructor() {
    this._ingredients = lazyObservable(sink => {
      this._ingredientsSink = sink;
      this.fetchIngredients();
    });
  }

  @computed
  get isLoading(): boolean {
    return this._ingredients.current() === undefined;
  }

  @computed
  get ingredients(): Ingredient[] {
    if (this.isLoading) {
      throw new Error("Attempt to dereference ingredients while IngredientStore is loading");
    }

    return this._ingredients.current();
  }

  public getIngredientById = createTransformer((id: Id) => {
    return this.ingredients.find(ingredient => ingredient.id === id);
  });

  private async fetchIngredients(): Promise<void> {
    const response = await request("ingredients", Method.GET);
    this._ingredientsSink(response.data.ingredients as Ingredient[]);
  }
}
