import {action, observable} from "mobx";

import {Id, Physician} from "models";
import {Method, request, Status as RequestStatus} from "utilities";

export class PhysicianStore {
  @observable public physicians?: Physician[];
  @observable public isLoading: boolean = false;

  @action
  private setPhysicians(physicians: Physician[]) {
    this.physicians = physicians;
  }

  @action
  private setIsLoading(isLoading: boolean) {
    this.isLoading = isLoading;
  }

  public getPhysicianById(id: Id) {
    if (this.physicians === undefined) {
      this.fetchPhysicians();
      return;
    } else {
      return this.physicians.find(physician => physician.id === id);
    }
  }

  public async fetchPhysicians() {
    this.setIsLoading(true);

    const response = await request("physicians", Method.GET);

    switch (response.status) {
      case RequestStatus.Success:
        this.setPhysicians(response.data.physicians as Physician[]);
        this.setIsLoading(false);
        break;

      case RequestStatus.Error:
        throw new Error(`Error while fetching physicians: ${response.error}`);
    }
  }
}
