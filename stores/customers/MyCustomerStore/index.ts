import {computed} from "mobx";

import {Customer} from "models";
import {IdentityStore} from "stores";

export class MyCustomerStore {
  private identityStore: IdentityStore;

  constructor(identityStore: IdentityStore) {
    this.identityStore = identityStore;
  }

  @computed
  get isLoading(): boolean {
    return this.identityStore.isLoading;
  }

  @computed
  get currentCustomer(): Customer {
    if (this.isLoading) {
      throw new Error("Cannot dereference currentCustomer while store is loading");
    }

    const currentIdentity = this.identityStore.currentIdentity!;
    if (currentIdentity.userType !== "Customer") {
      throw new Error("Must be logged in as Customer to use MyCustomerStore");
    }

    return currentIdentity.user as Customer;
  }
}
