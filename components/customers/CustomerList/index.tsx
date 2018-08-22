import {Tab2 as Tab, Tabs2 as Tabs} from "@blueprintjs/core";
import {inject, observer} from "mobx-react";
import * as React from "react";

import {FadeTransitionGroup, Pagination, Spinner} from "components/common";
import {CreateCustomerForm, Inbox} from "components/customers";
import {Customer} from "models";
import {CustomerStore} from "stores";
import {ActionsRequiredList} from "./ActionsRequiredList";
import {CustomerListItem} from "./CustomerListItem";

import * as styles from "./index.css";

interface Props {
  customerLabel?: string;
  canCreate?: boolean;
  canSeeCustomers?: boolean;
  customerStore?: CustomerStore;
  forPhysician?: boolean;
  renderStatus: (customer: Customer) => JSX.Element;
}

@inject("customerStore")
@observer
export class CustomerList extends React.Component<Props> {
  public static defaultProps: Partial<Props> = {
    customerLabel: "Customer",
    canCreate: true,
    canSeeCustomers: true,
  };

  public componentWillMount() {
    this.props.customerStore!.fetchCustomers(1);
  }

  public render() {
    return (
      <div className={styles.page}>
        {this.props.canCreate ? <CreateCustomerForm className={styles.createForm} /> : undefined}

        <h2 className={styles.heading}>{this.props.customerLabel}s</h2>

        {this.renderTabs()}
      </div>
    );
  }

  private selectPage(page: number) {
    this.props.customerStore!.fetchCustomers(page);
  }

  private renderTabs() {
    if (this.props.forPhysician) {
      return (
        <Tabs id="customerLists" className="pt-large">
          <Tab
            id="filtered"
            title="Action required"
            panel={this.renderCustomersWithActionsRequired()}
          />
          <Tab id="all" title="All customers" panel={this.renderCustomers()} />
          <Tab id="messages" title="All messages" panel={this.renderCustomerMessages()} />
        </Tabs>
      );
    } else {
      return this.renderCustomers();
    }
  }

  private renderCustomersWithActionsRequired() {
    return (
      <div className={styles.table}>
        <ActionsRequiredList
          renderStatus={this.props.renderStatus}
          isClickable={this.props.canSeeCustomers}
        />
      </div>
    );
  }

  private renderCustomers() {
    const {customers, totalPages, currentPage, isLoading} = this.props.customerStore!;

    if (isLoading) {
      return <Spinner title="Loading customers..." />;
    }

    return (
      <div className={styles.table}>
        <FadeTransitionGroup>
          {customers.map(customer => (
            <CustomerListItem
              customer={customer}
              key={customer.email}
              renderStatus={this.props.renderStatus}
              isClickable={this.props.canSeeCustomers}
            />
          ))}
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage || 1}
            onPageSelect={page => this.selectPage(page)}
          />
        </FadeTransitionGroup>
      </div>
    );
  }

  private renderCustomerMessages() {
    return (
      <div className={styles.table}>
        <Inbox />
      </div>
    );
  }
}
