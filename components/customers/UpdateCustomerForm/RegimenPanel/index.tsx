import {inject, observer} from "mobx-react";
import * as React from "react";

import {RegimenForm} from "components/regimens";
import {MyCustomerStore} from "stores/customers";

interface Props {
  myCustomerStore?: MyCustomerStore;
}

@inject("myCustomerStore")
@observer
export class RegimenPanel extends React.Component<Props> {
  public render() {
    const {currentCustomer} = this.props.myCustomerStore!;
    return (
      <RegimenForm
        regimen={currentCustomer.actualRegimen}
        allowNewProducts={true}
        withIngredients={false}
      />
    );
  }
}
