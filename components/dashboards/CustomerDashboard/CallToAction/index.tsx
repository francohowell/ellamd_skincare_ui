import {Button} from "@blueprintjs/core";
import {computed, observable} from "mobx";
import {inject, observer} from "mobx-react";
import {asyncAction} from "mobx-utils";
import * as React from "react";

import {CustomersApi} from "apis";
import {MedicalProfileField} from "components/medical-profiles/fields";
import {notifySuccess, notifyWarning} from "lib";
import {Customer, MedicalProfile, Subscription} from "models";
import {CustomerStore} from "stores";
import {MyCustomerStore, MyMedicalProfileAuditStore} from "stores/customers";

import * as storyStyles from "components/stories/index.css";

enum NextAction {
  None = "none",
  UpdateMedicalProfile = "update-medical-profile",
}

interface Props {
  customerStore?: CustomerStore;
  myMedicalProfileAuditStore?: MyMedicalProfileAuditStore;
  myCustomerStore?: MyCustomerStore;
}

class Store {
  private props: Props;

  @observable public isUpdating: boolean;

  constructor(props: Props) {
    this.props = props;
    this.isUpdating = false;
  }

  @computed
  get nextAction(): NextAction {
    if (this.subscription.needsProfileUpdate) {
      return NextAction.UpdateMedicalProfile;
    }

    return NextAction.None;
  }

  @computed
  get customer(): Customer {
    return this.props.myCustomerStore!.currentCustomer;
  }

  @computed
  get subscription(): Subscription {
    return this.customer.subscription;
  }

  @computed
  get medicalProfile(): MedicalProfile {
    return this.customer.medicalProfile;
  }

  @asyncAction
  public *unpauseSubscription(): IterableIterator<Promise<Customer>> {
    this.isUpdating = true;

    try {
      const newCustomer = yield CustomersApi.update(this.customer);
      this.props.customerStore!.replaceCustomer(newCustomer);
      this.props.myMedicalProfileAuditStore!.refresh();

      notifySuccess("Your profile has been updated!");
    } catch (error) {
      notifyWarning(error.message);
    } finally {
      this.isUpdating = false;
    }
  }
}

@inject("customerStore", "myMedicalProfileAuditStore", "myCustomerStore")
@observer
export class CallToAction extends React.Component<Props> {
  private store: Store;

  constructor(props: Props) {
    super(props);
    this.store = new Store(props);
  }

  public render() {
    switch (this.store.nextAction) {
      case NextAction.UpdateMedicalProfile:
        return this.renderMedicalProfileUpdate();
      case NextAction.None:
        return <div />;
    }
  }

  public renderMedicalProfileUpdate() {
    const {
      currentCustomer: {medicalProfile},
    } = this.props.myCustomerStore!;

    return (
      <div className={storyStyles.container}>
        <div className={storyStyles.meta}>
          <div className={storyStyles.timeAndFrom} />

          <div className={storyStyles.avatar}>
            <div className={storyStyles.avatarImage} />
          </div>
        </div>

        <div className={storyStyles.customerContent}>
          <h1>Important!</h1>
          <p>In order to get a new prescription you need to update the next information:</p>

          <div>
            <MedicalProfileField
              field="isPregnant"
              type="question"
              medicalProfile={medicalProfile}
            />
            <MedicalProfileField
              field="isBreastFeeding"
              type="question"
              medicalProfile={medicalProfile}
            />
          </div>

          <Button
            className="pt-large pt-intent-primary"
            onClick={() => this.store.unpauseSubscription()}
            loading={this.store.isUpdating}
          >
            Update
          </Button>
        </div>
      </div>
    );
  }
}
