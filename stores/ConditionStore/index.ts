import {computed} from "mobx";
import {createTransformer, ILazyObservable, lazyObservable} from "mobx-utils";

import {Method, request} from "lib";
import {Condition, Id} from "models";

export class ConditionStore {
  private _conditionsSink: (newValue: Condition[]) => void;
  private _conditions: ILazyObservable<Condition[]>;

  constructor() {
    this._conditions = lazyObservable(sink => {
      this._conditionsSink = sink;
      this.fetchConditions();
    });
  }

  @computed
  get isLoading(): boolean {
    return this._conditions.current() === undefined;
  }

  @computed
  get conditions(): Condition[] {
    if (this.isLoading) {
      throw new Error("Attempt to dereference conditions while ConditionStore is loading");
    }

    return this._conditions.current();
  }

  public getConditionDescription = createTransformer((id: Id) => {
    const foundCondition = this.conditions.find(condition => condition.id === id);
    return foundCondition ? foundCondition.description : "";
  });

  private async fetchConditions(): Promise<void> {
    const response = await request("conditions", Method.GET);
    this._conditionsSink(response.data.conditions as Condition[]);
  }
}
