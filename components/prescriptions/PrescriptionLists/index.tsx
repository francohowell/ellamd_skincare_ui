import {Tab2 as Tab, Tabs2 as Tabs} from "@blueprintjs/core";
import {action, computed, observable} from "mobx";
import {observer} from "mobx-react";
import {asyncAction, ILazyObservable, lazyObservable} from "mobx-utils";
import * as React from "react";

import {PaginatedPrescriptions, PrescriptionsApi} from "apis";
import {FadeTransitionGroup, Pagination, Spinner} from "components/common";
import {Prescription} from "models";

import {PrescriptionListItem} from "./PrescriptionListItem";

import * as styles from "./index.css";

type SelectedTab = "new" | "processing" | "filled";
type SortColumn = "name" | "created-at";

class Store {
  @observable public _isLoading: boolean;

  @observable public selectedTab: SelectedTab;
  @observable public sortColumn: SortColumn;
  @observable public sortAscending: boolean;
  @observable public totalPages: number;
  @observable public currentPage: number;

  private _prescriptionsSink: (prescriptions: Prescription[]) => void;
  private _prescriptions: ILazyObservable<Prescription[]>;

  constructor() {
    this.selectedTab = "new";
    this.sortColumn = "created-at";
    this.sortAscending = false;
    this.totalPages = 0;
    this.currentPage = 1;

    this._prescriptions = lazyObservable(sink => {
      this._prescriptionsSink = sink;
      this.fetchPrescriptions();
    });
  }

  @computed
  get isLoading(): boolean {
    return this._isLoading || this._prescriptions.current() === undefined;
  }

  @computed
  get prescriptions(): Prescription[] {
    if (this.isLoading) {
      throw new Error("Attempt to dereference prescriptions while Store is loading");
    }

    return this._prescriptions.current();
  }

  @action
  public setSelectedTab(selectedTab: SelectedTab) {
    this.selectedTab = selectedTab;
    this.fetchPrescriptions();
  }

  @action
  public setSortColumn(sortColumn: SortColumn) {
    if (this.sortColumn === sortColumn) {
      this.sortAscending = !this.sortAscending;
    } else {
      this.sortColumn = sortColumn;
      this.sortAscending = true;
    }

    this.fetchPrescriptions();
  }

  @action
  public setPage(page: number) {
    this.currentPage = page;
    this.fetchPrescriptions();
  }

  @asyncAction
  private *fetchPrescriptions(): IterableIterator<Promise<PaginatedPrescriptions>> {
    this._isLoading = true;

    const {prescriptions, currentPage, totalPages} = yield PrescriptionsApi.fetchPrescriptions({
      page: this.currentPage,
      filter: this.selectedTab,
      sortColumn: this.sortColumn,
      sortAscending: this.sortAscending,
    });

    this._isLoading = false;
    this.currentPage = currentPage;
    this.totalPages = totalPages;
    this._prescriptionsSink(prescriptions);
  }
}

@observer
export class PrescriptionLists extends React.Component {
  private store: Store;

  constructor() {
    super();
    this.store = new Store();
  }

  public render() {
    return (
      <div className={styles.page}>
        <h2 className={styles.heading}>Orders</h2>

        <Tabs
          id="prescriptionLists"
          className="pt-large"
          onChange={(newTabId: SelectedTab) => {
            this.store.setSelectedTab(newTabId);
          }}
        >
          <Tab id="new" title="New orders" />
          <Tab id="processing" title="Processing orders" />
          <Tab id="filled" title="Filled orders" />
        </Tabs>

        {this.renderPrescriptions()}
      </div>
    );
  }

  private renderPrescriptions() {
    if (this.store.isLoading) {
      return <Spinner title="Loading prescriptions..." />;
    }

    const {sortColumn, sortAscending} = this.store;
    const sortOrderChevron = sortAscending ? "pt-icon-chevron-up" : "pt-icon-chevron-down";

    return (
      <div className={styles.table}>
        <table className={`pt-table ${styles.table}`}>
          <thead>
            <tr>
              <th>Token</th>

              <th className={styles.sortable} onClick={() => this.store.setSortColumn("name")}>
                {sortColumn === "name" ? <strong>Customer name</strong> : "Customer name"}
                {sortColumn === "name" ? (
                  <span className={`${styles.sortIcon} pt-icon ${sortOrderChevron}`} />
                ) : (
                  undefined
                )}
              </th>

              <th
                className={styles.sortable}
                onClick={() => this.store.setSortColumn("created-at")}
              >
                {sortColumn === "created-at" ? <strong>RX created at</strong> : "RX created at"}
                {sortColumn === "created-at" ? (
                  <span className={`${styles.sortIcon} pt-icon ${sortOrderChevron}`} />
                ) : (
                  undefined
                )}
              </th>

              <th>Download</th>
              <th>Tracking</th>
            </tr>
          </thead>

          <FadeTransitionGroup component="tbody">
            {this.store.prescriptions.map(prescription => (
              <PrescriptionListItem prescription={prescription} key={prescription.id} />
            ))}
          </FadeTransitionGroup>
        </table>

        <Pagination
          totalPages={this.store.totalPages}
          currentPage={this.store.currentPage}
          onPageSelect={page => this.store.setPage(page)}
        />
      </div>
    );
  }
}
