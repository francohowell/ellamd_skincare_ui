import {computed} from "mobx";
import {inject, observer} from "mobx-react";
import * as moment from "moment";
import * as React from "react";

import {MyCustomerStore} from "stores/customers";

import * as styles from "./index.css";

interface Props {
  myCustomerStore?: MyCustomerStore;
}

class ComponentStore {
  private myCustomerStore: MyCustomerStore;

  constructor(myCustomerStore: MyCustomerStore) {
    this.myCustomerStore = myCustomerStore;
  }

  @computed
  get customerHasSignedUpRecently(): boolean {
    return this.myCustomerStore.currentCustomer.createdAtMoment.add(12, "hours") > moment();
  }
}

@inject("myCustomerStore")
@observer
export class Heading extends React.Component<Props> {
  private store: ComponentStore;

  constructor(props: Props, context: any) {
    super(props, context);
    this.store = new ComponentStore(this.props.myCustomerStore!);
  }

  public render() {
    const {currentCustomer} = this.props.myCustomerStore!;

    let greeting = "Welcome";
    let flattery = "You’re one step closer to natural, beautiful skin. What’s next?";

    if (!this.store.customerHasSignedUpRecently) {
      greeting = "Welcome back";

      if (currentCustomer.hasPhotos) {
        flattery = "Your skin is looking great today!";
      }
    }

    return (
      <div className={styles.heading}>
        <h1 className={styles.welcome}>
          {greeting}, {currentCustomer.firstName}.
        </h1>
        <span className={styles.flattery}>{flattery}</span>
      </div>
    );
  }
}
