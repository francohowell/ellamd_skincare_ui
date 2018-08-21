import {Spinner} from "@blueprintjs/core";
import {inject, observer} from "mobx-react";
import * as React from "react";
import {RouteComponentProps} from "react-router-dom";

import {MyCustomerStore} from "stores/customers";

import {Heading} from "./Heading";
import {Timeline} from "./Timeline";

import * as styles from "./index.css";

interface Props extends RouteComponentProps<any> {
  myCustomerStore?: MyCustomerStore;
}

@inject("myCustomerStore")
@observer
export class CustomerDashboard extends React.Component<Props> {
  public render() {
    if (this.props.myCustomerStore!.isLoading) {
      return <Spinner />;
    }

    return (
      <div className={styles.dashboard}>
        <Heading />
        <Timeline />
      </div>
    );
  }
}
