import {Collapse, Icon} from "@blueprintjs/core";
import {action, observable} from "mobx";
import {observer} from "mobx-react";
import * as React from "react";
import {SortableElement} from "react-sortable-hoc";

import {KeyIngredientsParagraph} from "components/products";
import {Regimen, RegimenProduct} from "models";

import * as styles from "./index.css";

interface Props {
  regimen: Regimen;
  regimenProduct: RegimenProduct;
  withIngredients: boolean;
}

class Store {
  @observable public isCollapsed: boolean;

  constructor() {
    this.isCollapsed = true;
  }

  @action
  public toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }
}

@observer
class RegimenProductsListEntry extends React.Component<Props> {
  private store: Store;

  constructor(props: Props) {
    super(props);
    this.store = new Store();
  }

  public render() {
    const {product} = this.props.regimenProduct;

    return (
      <li className={styles.productItem}>
        {product.nameWithBrand}

        {this.renderCollapseButton()}
        {this.renderRemoveButton()}
        {this.renderIngredientsCollapse()}
      </li>
    );
  }

  private renderCollapseButton() {
    if (!this.props.withIngredients) {
      return;
    }

    return (
      <Icon
        className={`${styles.productItemButton} ${styles.toggleIngredients}`}
        iconName={this.store.isCollapsed ? "caret-left" : "caret-down"}
        onClick={() => this.store.toggleCollapse()}
      />
    );
  }

  private renderRemoveButton() {
    const {regimen, regimenProduct} = this.props;

    return (
      <Icon
        className={`${styles.productItemButton} ${styles.removeProduct}`}
        iconName="small-cross"
        onClick={() => regimen.removeRegimenProduct(regimenProduct)}
      />
    );
  }

  private renderIngredientsCollapse() {
    const {product} = this.props.regimenProduct;

    if (!this.props.withIngredients) {
      return;
    }

    return (
      <Collapse isOpen={!this.store.isCollapsed}>
        <div className={styles.productIngredients}>
          <KeyIngredientsParagraph product={product} />
        </div>
      </Collapse>
    );
  }
}

// tslint:disable-next-line variable-name
export const RegimenProductsSortableListEntry = SortableElement(RegimenProductsListEntry);
