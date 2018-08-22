import {computed} from "mobx";
import {createTransformer, ILazyObservable, lazyObservable} from "mobx-utils";

import {PharmacistsApi} from "apis";
import {Id, Pharmacist} from "models";

export class PharmacistStore {
  private _pharmacistsSink: (newValue: Pharmacist[]) => void;
  private _pharmacists: ILazyObservable<Pharmacist[]>;

  constructor() {
    this._pharmacists = lazyObservable(sink => {
      this._pharmacistsSink = sink;
      this.fetchPharmacists();
    });
  }

  @computed
  get isLoading(): boolean {
    return this._pharmacists.current() === undefined;
  }

  @computed
  get pharmacists(): Pharmacist[] {
    if (this.isLoading) {
      throw new Error("Attempt to dereference pharmacists while PharmacistStore is loading");
    }

    return this._pharmacists.current();
  }

  public getPharmacistById = createTransformer((id: Id) => {
    return this.pharmacists.find(pharmacist => pharmacist.id === id);
  });

  public addPharmacist(pharmacist: Pharmacist) {
    const updatedPharmacists = this.pharmacists.slice();
    updatedPharmacists.unshift(pharmacist);

    this._pharmacistsSink(updatedPharmacists);
  }

  private async fetchPharmacists(): Promise<void> {
    const pharmacists = await PharmacistsApi.fetchPharmacists();
    this._pharmacistsSink(pharmacists);
  }
}
