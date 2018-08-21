import {Button, Dialog, NonIdealState} from "@blueprintjs/core";
import {action, computed, observable, runInAction} from "mobx";
import {observer} from "mobx-react";
import * as React from "react";
import {RouteComponentProps} from "react-router-dom";

import {ProductsApi} from "apis";
import {Spinner} from "components/common";
import {notifySuccess, notifyWarning} from "lib";
import {Product} from "models";

import * as styles from "./index.css";

interface Props extends RouteComponentProps<any> {}

class Store {
  @observable public isLoading: boolean;
  @observable public isSyncingProductInEdit: boolean;
  @observable public pendingProducts: Product[];
  @observable public productInEdit?: Product;

  constructor() {
    this.isLoading = true;
    this.isSyncingProductInEdit = false;
    this.fetchPendingProducts();
  }

  @computed
  get isDialogOpen(): boolean {
    return this.productInEdit !== undefined;
  }

  @action
  public openDialog(product: Product): void {
    this.productInEdit = product;
  }

  @action
  public closeDialog(): void {
    this.productInEdit = undefined;
  }

  @action
  public async syncProductInEdit(): Promise<void> {
    const product = this.productInEdit!;

    this.isSyncingProductInEdit = true;

    try {
      await ProductsApi.syncProduct(product);
      this.closeDialog();
      this.removePendingProduct(product);
      notifySuccess("Product has been updated");
    } catch (error) {
      notifyWarning(error.message);
    } finally {
      runInAction(() => {
        this.isSyncingProductInEdit = false;
      });
    }
  }

  @action
  private removePendingProduct(product: Product): void {
    const index = this.pendingProducts.indexOf(product);

    if (index > -1) {
      this.pendingProducts.splice(index, 1);
    }
  }

  @action
  private async fetchPendingProducts(): Promise<void> {
    const products = await ProductsApi.fetchPendingProducts();

    runInAction(() => {
      this.pendingProducts = products;
      this.isLoading = false;
    });
  }
}

@observer
export class ProductSection extends React.Component<Props> {
  private store: Store;

  constructor(props: Props) {
    super(props);
    this.store = new Store();
  }

  public render() {
    if (this.store.isLoading) {
      return <Spinner title="Products are loading..." />;
    }

    return (
      <div className={styles.page}>
        <h2 className={styles.heading}>Pending products</h2>

        <div className={styles.table}>{this.renderProductList()}</div>

        {this.renderEditDialog()}
      </div>
    );
  }

  private renderProductList() {
    const {pendingProducts} = this.store;

    if (pendingProducts.length === 0) {
      return (
        <NonIdealState
          title="No pending products"
          description="Product appears in this list when customer adds unknown product to his regimen"
          visual="list"
        />
      );
    }

    return (
      <div> {this.store.pendingProducts.map(product => this.renderProductListItem(product))}</div>
    );
  }

  private renderProductListItem(product: Product) {
    return (
      <div
        key={product.id}
        className={styles.productRow}
        onClick={() => this.store.openDialog(product)}
      >
        <div className={styles.fields}>
          <div className={`${styles.field} ${styles.id}`}>#{product.id}</div>
          <div className={`${styles.field} ${styles.nameField}`}>
            <span className={styles.name}>{product.nameWithBrand}</span>
          </div>

          <div className={styles.field}>
            {product.createdAt!.format("M/D/YY")}
            <span className={styles.label}>Created</span>
          </div>

          <div className={styles.field}>
            {product.productIngredients.length}
            <span className={styles.label}>Ingredients</span>
          </div>
        </div>
      </div>
    );
  }

  private renderEditDialog() {
    if (!this.store.isDialogOpen) {
      return;
    }

    return (
      <Dialog
        title="Edit product"
        isOpen={this.store.isDialogOpen}
        onClose={() => this.store.closeDialog()}
      >
        {this.renderProductInEditForm()}
      </Dialog>
    );
  }

  private renderProductInEditForm() {
    const product = this.store.productInEdit!;

    return (
      <form>
        <div className="pt-dialog-body">
          <label className="pt-label">
            Brand
            <input
              className="pt-input pt-fill"
              type="text"
              onChange={event => product.setFields({brand: event.target.value})}
              value={product.brand}
            />
          </label>

          <label className="pt-label">
            Name
            <input
              className="pt-input pt-fill"
              type="text"
              onChange={event => product.setFields({name: event.target.value})}
              value={product.name}
            />
          </label>

          <label className="pt-label">
            URL
            <input
              className="pt-input pt-fill"
              type="text"
              onChange={event => product.setFields({productUrl: event.target.value})}
              value={product.productUrl}
            />
          </label>

          <label className="pt-label">
            Ingredients (comma- or newline-separated list)
            <textarea
              className="pt-input pt-fill"
              onChange={event => product.setFields({ingredientsString: event.target.value})}
              value={product.ingredientsString}
            />
          </label>
        </div>

        <div className="pt-dialog-footer">
          <div className="pt-dialog-footer-actions">
            <Button onClick={() => this.store.closeDialog()}>Cancel</Button>

            <Button
              onClick={() => this.store.syncProductInEdit()}
              className="pt-intent-primary"
              loading={this.store.isSyncingProductInEdit}
            >
              Update product
            </Button>
          </div>
        </div>
      </form>
    );
  }
}
