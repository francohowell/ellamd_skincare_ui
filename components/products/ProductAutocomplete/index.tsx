import {action, observable} from "mobx";
import {observer} from "mobx-react";
import * as React from "react";
import {InstantSearch} from "react-instantsearch/dom";

import {Product, ProductSource} from "models";

import {AlgoliaAutocomplete, Hit} from "./AlgoliaAutocomplete";

interface Props {
  allowNewProducts: boolean;
  onProductSelect: (product: Product) => void;
}

class Store {
  @observable public query: string;

  constructor() {
    this.query = "";
  }

  @action
  public setQuery(query: string): void {
    this.query = query;
  }
}

@observer
export class ProductAutocomplete extends React.Component<Props> {
  private store: Store;

  constructor(props: Props) {
    super(props);
    this.store = new Store();
  }

  public render() {
    return (
      <InstantSearch
        appId={process.env.ALGOLIA_APP_ID}
        apiKey={process.env.ALGOLIA_SECRET_KEY}
        indexName={`Product_${process.env.NODE_ENV}`}
      >
        <AlgoliaAutocomplete
          hitsToSuggestions={(hits: Hit[]) => this.hitsToProducts(hits)}
          renderSuggestion={(product: Product) => this.renderProduct(product)}
          getSuggestionValue={(product: Product) => this.getSuggestionValue(product)}
          onSuggestionSelect={(suggestion: any) => this.props.onProductSelect(suggestion)}
          onQueryUpdate={(query: string) => this.store.setQuery(query)}
        />
      </InstantSearch>
    );
  }

  private hitsToProducts = (hits: Hit[]): Product[] => {
    const products = hits.map(hit => new Product(hit));

    if (this.props.allowNewProducts) {
      const newProduct = new Product({store: ProductSource.Custom, name: this.store.query});
      products.push(newProduct);
    }

    return products;
  };

  private renderProduct = (product: Product): JSX.Element => {
    if (product.isNew) {
      return (
        <div>
          <i>[+] Create new product:</i> {product.name}
        </div>
      );
    } else {
      return <div>{product.nameWithBrand}</div>;
    }
  };

  private getSuggestionValue = (product: Product): string => {
    return product.nameWithBrand;
  };
}
