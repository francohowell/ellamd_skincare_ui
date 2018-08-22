import {action, observable} from "mobx";

import {Customer, Id, Prescription} from "models";
import {IdentityStore} from "stores";
import {Method, request, Status as RequestStatus} from "utilities";

interface Stores {
  identityStore: IdentityStore;
}

export class CustomerStore {
  @observable public customers: Customer[] = [];
  @observable public customersWithMessages: Customer[] = [];
  @observable public customersWithActionsRequired: Customer[] = [];

  @observable public isLoading: boolean = false;
  @observable public isLoadingWithMessages: boolean = false;
  @observable public isLoadingWithActionsRequired: boolean = false;

  @observable public currentPage?: number;
  @observable public currentPageForWithActionsRequired?: number;

  @observable public totalPages: number = 0;
  @observable public totalPagesWithActionsRequried: number = 0;

  private stores: Stores;

  constructor(stores: Stores) {
    this.stores = stores;
  }

  @action
  public async fetchOneTimeToken(prescription: Prescription) {
    const response = await request(`prescriptions/get-token/${prescription.token}`, Method.GET);

    switch (response.status) {
      case RequestStatus.Success:
        return response.data.token;

      case RequestStatus.Error:
        throw new Error(`Error while authenticating action: ${response.error}`);
    }
  }

  @action
  private setCustomers(customers: Customer[]) {
    this.customers = customers;
  }

  @action
  private setCurrentPage(page?: number) {
    this.currentPage = page;
  }

  @action
  private setCurrentPageForWithActionsRequired(page?: number) {
    this.currentPageForWithActionsRequired = page;
  }

  @action
  private setTotalPages(totalPages: number) {
    this.totalPages = totalPages;
  }

  @action
  private setTotalPagesWithActionsRequried(totalPages: number) {
    this.totalPagesWithActionsRequried = totalPages;
  }

  @action
  private setCustomersWithMessages(customers: Customer[]) {
    this.customersWithMessages = customers;
  }

  @action
  private setCustomersWithActionsRequired(customers: Customer[]) {
    this.customersWithActionsRequired = customers;
  }

  @action
  private setIsLoading(isLoading: boolean) {
    this.isLoading = isLoading;
  }

  @action
  private setIsLoadingWithMessages(isLoading: boolean) {
    this.isLoadingWithMessages = isLoading;
  }

  @action
  private setIsLoadingWithActionsRequired(isLoading: boolean) {
    this.isLoadingWithActionsRequired = isLoading;
  }

  @action
  public addCustomer(customer: Customer) {
    if (!this.customers.length) {
      this.customers = [customer];
    } else {
      this.customers.unshift(customer);
    }
  }

  @action
  public removeCustomer(customer: Customer) {
    if (!this.customers.length) return;
    this.customers = this.customers.filter(existingCustomer => existingCustomer.id !== customer.id);
  }

  @action
  public replaceCustomer(customer: Customer) {
    if (!this.customers.length) {
      this.customers = [customer];
    } else {
      this.customers = [customer].concat(
        this.customers.filter(existingCustomer => existingCustomer.id !== customer.id)
      );
    }

    if (
      this.stores.identityStore.currentIdentity &&
      this.stores.identityStore.currentIdentity.user &&
      this.stores.identityStore.currentIdentity.userType === "Customer" &&
      this.stores.identityStore.currentIdentity.user.id === customer.id
    ) {
      this.stores.identityStore.replaceUser(customer);
    }
  }

  public getCustomerById(id: Id) {
    if (!this.customers.length) {
      this.fetchCustomers();
      return;
    } else {
      return this.customers.find(customer => customer.id === id);
    }
  }

  public async fetchCustomers(page?: number) {
    this.setCurrentPage(page);
    this.setIsLoading(true);

    const query = this.currentPage ? `page=${this.currentPage}` : "";
    const response = await request(`customers?${query}`, Method.GET);

    switch (response.status) {
      case RequestStatus.Success:
        const {customers, meta} = response.data;
        this.setCustomers(customers.map((data: any) => new Customer(data)));
        this.setIsLoading(false);

        if (meta) {
          this.setTotalPages(meta.totalPages);
        }
        break;

      case RequestStatus.Error:
        throw new Error(`Error while fetching customers: ${response.error}`);
    }
  }

  public async fetchCustomersWithActionsRequired(page?: number) {
    this.setCurrentPageForWithActionsRequired(page);
    this.setIsLoadingWithActionsRequired(true);

    const query = this.currentPage ? `page=${this.currentPage}` : "";
    const response = await request(`customers?actions_required=1&${query}`, Method.GET);

    switch (response.status) {
      case RequestStatus.Success:
        const {customers, meta} = response.data;
        this.setCustomersWithActionsRequired(customers.map((data: any) => new Customer(data)));
        this.setIsLoadingWithActionsRequired(false);

        if (meta) {
          this.setTotalPagesWithActionsRequried(meta.totalPages);
        }
        break;

      case RequestStatus.Error:
        throw new Error(`Error while fetching customers: ${response.error}`);
    }
  }

  public async fetchCustomersWithMessages() {
    this.setIsLoadingWithMessages(true);

    const response = await request("customers?with_messages=1", Method.GET);

    switch (response.status) {
      case RequestStatus.Success:
        const customers = response.data.customers.map((data: any) => new Customer(data));
        this.setCustomersWithMessages(customers);
        this.setIsLoadingWithMessages(false);
        break;

      case RequestStatus.Error:
        throw new Error(`Error while fetching customers: ${response.error}`);
    }
  }
}
