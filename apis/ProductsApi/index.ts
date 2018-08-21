import {toJS} from "mobx";

import {Method, request} from "lib";
import {Product} from "models";

export namespace ProductsApi {
  export const fetchAutocompleteSuggestions = async (query: string): Promise<Product[]> => {
    const response = await request(`autocomplete/products?query=${query}`, Method.GET);
    return instantiateProducts(response.data.products);
  };

  export const fetchPendingProducts = async (): Promise<Product[]> => {
    const response = await request(`products?pending=t`, Method.GET);
    return instantiateProducts(response.data.products);
  };

  export const syncProduct = async (product: Product): Promise<void> => {
    const response = await request(`products`, Method.POST, {
      product: toJS(product),
    });
    const newProduct = instantiateProduct(response.data.product);

    product.setFields(newProduct);
  };

  function instantiateProducts(productsParams: any[]): Product[] {
    return productsParams.map(instantiateProduct);
  }

  function instantiateProduct(productParams: any): Product {
    return Product.fromJS(productParams);
  }
}
