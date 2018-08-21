import {computed} from "mobx";

import {Photo} from "models";
import {MyCustomerStore} from "stores/customers";

// TODO: load photos from /customers/photos
export class MyPhotoStore {
  private myCustomerStore: MyCustomerStore;

  constructor(myCustomerStore: MyCustomerStore) {
    this.myCustomerStore = myCustomerStore;
  }

  @computed
  get isLoading(): boolean {
    return this.myCustomerStore.isLoading;
  }

  @computed
  get descendingPhotos(): Photo[] {
    return this.photos.slice().sort((photoA, photoB) => -photoA.createdAt.diff(photoB.createdAt));
  }

  @computed
  get photos(): Photo[] {
    if (this.isLoading) {
      throw new Error("Attempt to dereference photos while MyPhotoStore is loading");
    }

    return this.myCustomerStore.currentCustomer.photos;
  }
}
