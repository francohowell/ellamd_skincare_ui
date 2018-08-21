import {computed} from "mobx";
import {createTransformer, ILazyObservable, lazyObservable} from "mobx-utils";

import {Method, request} from "lib";
import {Formulation, Id} from "models";

export class FormulationStore {
  private _formulationsSink: (newValue: Formulation[]) => void;
  private _formulations: ILazyObservable<Formulation[]>;

  constructor() {
    this._formulations = lazyObservable(sink => {
      this._formulationsSink = sink;
      this.fetchFormulations();
    });
  }

  @computed
  get isLoading(): boolean {
    return this._formulations.current() === undefined;
  }

  @computed
  get formulations(): Formulation[] {
    if (this.isLoading) {
      throw new Error("Attempt to dereference formulations while FormulationStore is loading");
    }

    return this._formulations.current();
  }

  public getFormulationById = createTransformer((id: Id) => {
    return this.formulations.find(formulation => formulation.id === id);
  });

  private async fetchFormulations(): Promise<void> {
    const response = await request("formulations", Method.GET);
    this._formulationsSink(response.data.formulations as Formulation[]);
  }
}
