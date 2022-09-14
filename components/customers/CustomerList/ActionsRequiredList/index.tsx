import {inject, observer} from "mobx-react";
import * as React from "react";

import {FadeTransitionGroup, Pagination, Spinner} from "components/common";
import {Customer} from "models";
import {CustomerStore} from "stores";
import {CustomerListItem} from "../CustomerListItem";

import * as styles from "../index.css";

interface Props {
  customerStore?: CustomerStore;
  isClickable?: boolean;
  renderStatus: (customer: Customer) => JSX.Element;
}
interface State {}

@inject("customerStore")
@observer
export class ActionsRequiredList extends React.Component<Props, State> {
  public componentWillMount() {
    this.props.customerStore!.fetchCustomersWithActionsRequired(1);
  }

  private selectPage(page: number) {
    this.props.customerStore!.fetchCustomersWithActionsRequired(page);
  }

  private renderCustomers() {
    const {
      customersWithActionsRequired,
      totalPagesWithActionsRequried,
      currentPageForWithActionsRequired,
      isLoadingWithActionsRequired,
    } = this.props.customerStore!;

    if (isLoadingWithActionsRequired) {
      return <Spinner title="Loading customers..." />;
    }

    return (
      <div className={styles.table}>
        <FadeTransitionGroup>
          {customersWithActionsRequired.map(customer => (
            <CustomerListItem
              customer={customer}
              key={customer.email}
              renderStatus={this.props.renderStatus}
              isClickable={this.props.isClickable}
            />
          ))}
          <Pagination
            totalPages={totalPagesWithActionsRequried}
            currentPage={currentPageForWithActionsRequired || 1}
            onPageSelect={page => this.selectPage(page)}
          />
        </FadeTransitionGroup>
      </div>
    );
  }

  public render() {
    return <div className={styles.page}>{this.renderCustomers()}</div>;
  }
}
