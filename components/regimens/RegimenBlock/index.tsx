import {observer} from "mobx-react";
import * as React from "react";

import {CollapsibleSection} from "components/common";
import {KeyIngredientsParagraph} from "components/products";
import {Regimen, RegimenProduct, RegimenProductPeriod} from "models";

import * as styles from "./index.css";

interface Props {
  regimen?: Regimen;
}

@observer
export class RegimenBlock extends React.Component<Props> {
  public render() {
    const {regimen} = this.props;

    if (regimen === undefined || regimen.regimenProducts.length === 0) {
      return <p>No regimen</p>;
    }

    return (
      <div className={styles.regimen}>
        <h4>AM regimen</h4>
        {this.renderRegimenPeriod(regimen, "am")}

        <h4>PM regimen</h4>
        {this.renderRegimenPeriod(regimen, "pm")}
      </div>
    );
  }

  private renderRegimenPeriod(regimen: Regimen, period: RegimenProductPeriod) {
    const regimenProducts = regimen.periodRegimenProducts(period);

    if (regimenProducts.length === 0) {
      return <div className={styles.regimenPeriod}>No regimen</div>;
    }

    return (
      <div className={styles.regimenPeriod}>
        {regimenProducts.map(regimenProduct => this.renderRegimenProduct(regimenProduct))}
      </div>
    );
  }

  private renderRegimenProduct(regimenProduct: RegimenProduct) {
    return (
      <div key={regimenProduct.id}>
        <CollapsibleSection title={this.renderRegimenProductTitle(regimenProduct)}>
          <KeyIngredientsParagraph product={regimenProduct.product} />
        </CollapsibleSection>
      </div>
    );
  }

  private renderRegimenProductTitle(regimenProduct: RegimenProduct) {
    const {product} = regimenProduct;

    return (
      <span className={styles.product}>
        <span className={styles.productIndex}>{regimenProduct.position + 1}.</span>
        <span className={styles.productName}>{product.nameWithBrand}</span>
      </span>
    );
  }
}
