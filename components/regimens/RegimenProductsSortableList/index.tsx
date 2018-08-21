import {observer} from "mobx-react";
import {Regimen, RegimenProduct} from "models";
import * as React from "react";
import {SortableContainer} from "react-sortable-hoc";
import {RegimenProductsSortableListEntry} from "../RegimenProductsSortableListEntry";
import * as styles from "./index.css";

interface Props {
  regimen: Regimen;
  regimenProducts: RegimenProduct[];
  withIngredients: boolean;
}

@observer
class RegimenProductsList extends React.Component<Props> {
  public render() {
    const {regimen, regimenProducts, withIngredients} = this.props;

    return (
      <ul className={styles.productList}>
        {regimenProducts.map((regimenProduct, index) => (
          <RegimenProductsSortableListEntry
            key={index}
            index={regimenProduct.position}
            regimen={regimen}
            regimenProduct={regimenProduct}
            withIngredients={withIngredients}
          />
        ))}
      </ul>
    );
  }
}

// tslint:disable-next-line variable-name
export const RegimenProductsSortableList = SortableContainer(RegimenProductsList);
