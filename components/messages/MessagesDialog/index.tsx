import {Button, Dialog} from "@blueprintjs/core";
import {action, computed, observable} from "mobx";
import {inject, observer} from "mobx-react";
import * as React from "react";

import {Spinner} from "components/common";
import {MessagesForm, MessagesList} from "components/messages";
import {Customer} from "models";
import {PhysicianStore} from "stores";
import {MyMessageStore} from "stores/customers";

import * as styles from "./index.css";

interface Props {
  customer: Customer;
  myMessageStore?: MyMessageStore;
  physicianStore?: PhysicianStore;
}

class Store {
  @observable public isDialogOpen: boolean;

  private props: Props;

  constructor(props: Props) {
    this.props = props;
    this.isDialogOpen = false;
  }

  @computed
  get isLoading(): boolean {
    return this.props.physicianStore!.isLoading || this.props.myMessageStore!.isLoading;
  }

  @action
  public closeDialog() {
    this.isDialogOpen = false;
  }

  @action
  public openDialog() {
    this.isDialogOpen = true;
  }

  @action
  public submitMessage(messageString: string) {
    this.props.myMessageStore!.sendMessage(messageString);
  }
}

@inject("myMessageStore", "physicianStore")
@observer
export class MessagesDialog extends React.Component<Props> {
  private store: Store;

  constructor(props: Props) {
    super(props);
    this.store = new Store(props);
  }

  public render() {
    return (
      <div className={[styles.wrapper].join(" ")}>
        <Button className="pt-large" iconName="envelope" onClick={() => this.store.openDialog()}>
          Send Dr. Blake a message
        </Button>

        <Dialog
          isOpen={this.store.isDialogOpen}
          onClose={() => this.store.closeDialog()}
          title="Messages"
        >
          <div className="pt-dialog-body">{this.renderDialogBody()}</div>
        </Dialog>
      </div>
    );
  }

  private renderDialogBody() {
    const {customer} = this.props;
    const physician = this.props.physicianStore!.getPhysicianById(customer.physicianId)!;

    if (this.store.isLoading) {
      return <Spinner title="Loading messages..." />;
    }

    return (
      <div>
        <MessagesList
          messages={this.props.myMessageStore!.messages}
          customer={customer}
          physician={physician}
        />-
        <MessagesForm onMessageSubmit={messageString => this.store.submitMessage(messageString)} />
      </div>
    );
  }
}
