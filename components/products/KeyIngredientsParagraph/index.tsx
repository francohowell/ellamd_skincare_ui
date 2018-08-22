import * as React from "react";

import {Product, ProductIngredient} from "models";

interface Props {
  product: Product;
}

export class KeyIngredientsParagraph extends React.Component<Props> {
  public render() {
    const {product} = this.props;

    if (product.isPending) {
      return <p>Wait for EllaMD stuff to update ingredients list for this product.</p>;
    }

    if (product.brand === "EllaMD") {
      return <p>Check prescription for ingredients list.</p>;
    }

    if (product.productIngredients.length === 0) {
      return (
        <p>
          Ingredient list is missing...
          <br />
          {this.renderMissingIngredientsTip(product)}
        </p>
      );
    }

    return this.renderProductIngredientsString(product.productIngredients);
  }

  private renderMissingIngredientsTip(product: Product) {
    if (product.productUrl) {
      return (
        <span>
          {"You might find it in product page "}
          <a href={product.productUrl} target="_blank">
            {product.productUrl}
          </a>
        </span>
      );
    } else {
      return <span>Please contact EllaMD stuff to resolve the issue.</span>;
    }
  }

  private renderProductIngredientsString(productIngredients: ProductIngredient[]) {
    return (
      <p>
        <b>{"Ingredients "}</b>:
        {productIngredients
          .filter(pi => pi.isKey)
          .map(pi => pi.name)
          .join(", ")}.
      </p>
    );
  }
}
