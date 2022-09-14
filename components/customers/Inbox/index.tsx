import {action, computed, observable} from "mobx";
import {inject, observer} from "mobx-react";
import * as React from "react";

import {Spinner} from "components/common";
import {MessagesForm, MessagesList} from "components/messages";
import {Customer, Message, Physician} from "models";
import {CustomerMessageStore, CustomerStore, PhysicianStore} from "stores";

import {CustomerSelector} from "./CustomerSelector";

import * as styles from "./index.css";

interface Props {
  customerStore?: CustomerStore;
  customerMessageStore?: CustomerMessageStore;
  physicianStore?: PhysicianStore;
}

class Store {
  private props: Props;

  @observable public selectedCustomer?: Customer;

  constructor(props: Props) {
    this.props = props;
  }

  @computed
  get isLoadingCustomers(): boolean {
    return this.props.customerStore!.isLoadingWithMessages;
  }

  @computed
  get isLoadingSelectedCustomerInbox(): boolean {
    return this.props.physicianStore!.isLoading || this.props.customerMessageStore!.isLoading;
  }

  @computed
  get selectedCustomerPhysician(): Physician | undefined {
    if (!this.selectedCustomer) {
      return;
    }

    return this.props.physicianStore!.getPhysicianById(this.selectedCustomer.physicianId!)!;
  }

  @computed
  get messages(): Message[] | undefined {
    return this.props.customerMessageStore!.messages;
  }

  @action
  public selectCustomer = (customer: Customer): void => {
    this.selectedCustomer = customer;
    this.props.customerMessageStore!.fetchMessages(customer.id);
  };

  @action
  public submitMessage = (message: string): void => {
    if (!this.selectedCustomer) {
      return;
    }

    this.props.customerMessageStore!.sendMessage(this.selectedCustomer.id, message);
  };
}

@inject("customerStore", "customerMessageStore", "physicianStore")
@observer
export class Inbox extends React.Component<Props> {
  public store: Store;

  public constructor(props: Props) {
    super(props);
    this.store = new Store(props);
  }

  public componentWillMount() {
    this.props.customerStore!.fetchCustomersWithMessages();
  }

  public render() {
    const {customersWithMessages} = this.props.customerStore!;

    if (this.store.isLoadingCustomers) {
      return <Spinner title="Loading customers..." />;
    }

    if (customersWithMessages.length === 0) {
      return <div>No customers have started a conversation yet.</div>;
    }

    return (
      <div className={styles.inbox}>
        <div className={styles.customers}>
          <CustomerSelector
            customers={customersWithMessages}
            selected={this.store.selectedCustomer}
            onSelect={customer => this.store.selectCustomer(customer)}
          />
        </div>

        <div className={styles.messages}>{this.renderSelectedCustomerInbox()}</div>
      </div>
    );
  }

  private renderSelectedCustomerInbox() {
    const {messages, selectedCustomer, selectedCustomerPhysician} = this.store;

    if (!selectedCustomer) {
      return <div className={styles.noCustomerSelected}>No customer selected</div>;
    }

    if (this.store.isLoadingSelectedCustomerInbox) {
      return <Spinner title="Loading messages..." />;
    }

    return (
      <div>
        <MessagesList
          messages={messages!}
          customer={selectedCustomer!}
          physician={selectedCustomerPhysician!}
        />
        <MessagesForm onMessageSubmit={message => this.store.submitMessage(message)} />
      </div>
    );
  }
}
