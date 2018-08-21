import {Tab2 as Tab, Tabs2 as Tabs} from "@blueprintjs/core";
import {observer} from "mobx-react";
import * as React from "react";
import {SortEnd} from "react-sortable-hoc";

import {ProductAutocomplete} from "components/products";
import {Product, Regimen, RegimenProductPeriod} from "models";

import {RegimenProductsSortableList} from "../RegimenProductsSortableList";

import * as styles from "./index.css";

interface Props {
  regimen: Regimen;
  allowNewProducts: boolean;
  withIngredients: boolean;
}

@observer
export class RegimenForm extends React.Component<Props> {
  public render() {
    return (
      <div>
        <Tabs id="RegimenPeriodPanels">
          <Tab id="amPanel" title="Daytime Regimen" panel={this.renderPeriodPanel("am")} />
          <Tab id="pmPanel" title="Nighttime Regimen" panel={this.renderPeriodPanel("pm")} />
        </Tabs>
      </div>
    );
  }

  private renderPeriodPanel(period: RegimenProductPeriod) {
    const {allowNewProducts, regimen} = this.props;

    const onProductSelect = (product: Product): void => {
      regimen.addProduct(period, product);
    };

    return (
      <div>
        <ProductAutocomplete
          allowNewProducts={allowNewProducts}
          onProductSelect={onProductSelect}
        />
        {this.renderRegimenProducts(period)}
      </div>
    );
  }

  private renderRegimenProducts(period: RegimenProductPeriod) {
    const {regimen, withIngredients} = this.props;
    const regimenProducts = regimen.periodRegimenProducts(period);

    const onSortEnd = (newOrder: SortEnd) => {
      const {oldIndex, newIndex} = newOrder;
      regimen.repositionRegimenProduct(period, oldIndex, newIndex);
    };

    if (regimenProducts.length === 0) {
      return <div className={styles.zeroProducts}>No products selected</div>;
    }

    return (
      <RegimenProductsSortableList
        distance={1}
        onSortEnd={onSortEnd}
        regimen={regimen}
        regimenProducts={regimenProducts}
        withIngredients={withIngredients}
      />
    );
  }
}
