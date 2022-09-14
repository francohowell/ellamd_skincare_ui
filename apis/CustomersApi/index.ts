import {toJS} from "mobx";

import {Method, request} from "lib";
import {Customer, Id} from "models";

export namespace CustomersApi {
  export const index = async (page: number) => {
    const response = await request(`customers?page=${page}`, Method.GET);

    return (response.data.customers as Customer[]).map(customerParams => {
      return new Customer(customerParams);
    });
  };

  export const show = async (id: Id) => {
    const response = await request(`customers/${id}`, Method.GET);
    return new Customer(response.data.customer);
  };

  export const update = async (customer: Customer, params?: object): Promise<Customer> => {
    if (!params) {
      params = {};
    }

    const customerPromise = request(`customers/${customer.id}/update`, Method.POST, {
      ...toJS(customer),
      actialRegimen: undefined,
      visits: undefined,
      ...params,
    });

    const regimenPromise = request(`my/regimens`, Method.POST, {
      regimen: toJS(customer.actualRegimen),
    });

    const customerParams = (await customerPromise).data.customer as Customer;
    customerParams.actualRegimen = (await regimenPromise).data.regimen;

    return instantiateCustomer(customerParams);
  };

  export const createVisit = async (customerId: Id) => {
    const response = await request(`customers/${customerId}/create-visit`, Method.POST);
    return new Customer(response.data.customer);
  };

  function instantiateCustomer(customerParams: any) {
    return new Customer(customerParams);
  }
}
