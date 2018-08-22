import {Button, Dialog, Intent, Tab2 as Tab, Tabs2 as Tabs} from "@blueprintjs/core";
import {inject, observer} from "mobx-react";
import * as React from "react";
import {Elements as StripeElements} from "react-stripe-elements";

import {CustomersApi} from "apis";
import {FadeTransitionGroup, RiseTransitionGroup} from "components/common";
import {AddressField, CustomerField} from "components/customers";
import {
  DateOfBirthField,
  MedicalProfileField,
  PreferredFragranceField,
  SexField,
  SkinConcernsField,
  SkinTypeField,
  SunscreenFrequencyField,
} from "components/medical-profiles";
import {Customer} from "models";
import {CustomerStore} from "stores";
import {MyMedicalProfileAuditStore} from "stores/customers";
import {SubmitEvent, Toaster} from "utilities";

import {RegimenPanel} from "./RegimenPanel";
import {SubscriptionPanel} from "./SubscriptionPanel";

import * as styles from "./index.css";

interface Props {
  initialCustomer: Customer;
  customerStore?: CustomerStore;
  className?: string;
  myMedicalProfileAuditStore?: MyMedicalProfileAuditStore;
}

interface State {
  isOpen: boolean;
  customer: Customer;
  hasError: boolean;
  errorMessage?: string;
  isLoading: boolean;
}

@inject("customerStore", "myMedicalProfileAuditStore")
@observer
export class UpdateCustomerForm extends React.Component<Props, State> {
  public state: State = {
    isOpen: false,
    customer: this.props.initialCustomer,
    hasError: false,
    errorMessage: undefined,
    isLoading: false,
  };

  private toggleForm = () => {
    this.setState({isOpen: !this.state.isOpen});
  };

  private handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();

    try {
      this.setState({isLoading: true, hasError: false});

      const newCustomer = await CustomersApi.update(this.state.customer);
      this.props.customerStore!.replaceCustomer(newCustomer);
      this.props.myMedicalProfileAuditStore!.refresh();
      Toaster.show({message: "Profile updated!", intent: Intent.SUCCESS, iconName: "tick"});

      this.setState({isOpen: false});
    } catch (error) {
      this.setState({hasError: true, errorMessage: error.message});
    } finally {
      this.setState({isLoading: false});
    }
  };

  private renderError() {
    if (!this.state.hasError) {
      return;
    }

    return (
      <div className={styles.errorWrapper}>
        <div className="pt-callout pt-intent-danger">{this.state.errorMessage}</div>
      </div>
    );
  }

  private renderContactForm() {
    return (
      <div>
        <div className={styles.columns}>
          <CustomerField field="firstName" customer={this.state.customer} />
          <CustomerField field="lastName" customer={this.state.customer} />
        </div>

        <DateOfBirthField field="dateOfBirth" medicalProfile={this.state.customer.medicalProfile} />

        <SexField field="sex" medicalProfile={this.state.customer.medicalProfile} />

        <div className={styles.columns}>
          <CustomerField field="email" customer={this.state.customer} />
          <CustomerField field="phone" customer={this.state.customer} />
        </div>

        <AddressField customer={this.state.customer} />
        <CustomerField field="addressLine2" customer={this.state.customer} />
      </div>
    );
  }

  private renderMedicalForm() {
    const {medicalProfile} = this.state.customer;

    return (
      <div>
        <MedicalProfileField
          field="knownAllergies"
          type="question"
          medicalProfile={medicalProfile}
        />
        <MedicalProfileField field="isSmoker" type="question" medicalProfile={medicalProfile} />
        <MedicalProfileField
          field="hasBeenOnAccutane"
          type="question"
          medicalProfile={medicalProfile}
        />
        <MedicalProfileField
          field="hasHormonalIssues"
          type="question"
          medicalProfile={medicalProfile}
        />
        <MedicalProfileField field="isPregnant" type="question" medicalProfile={medicalProfile} />
        <MedicalProfileField
          field="isBreastFeeding"
          type="question"
          medicalProfile={medicalProfile}
        />
        <MedicalProfileField
          field="isOnBirthControl"
          type="question"
          medicalProfile={medicalProfile}
        />
        <MedicalProfileField
          field="otherConcerns"
          type="question"
          medicalProfile={medicalProfile}
        />
        <MedicalProfileField
          field="currentPrescriptionTopicalMedications"
          type="question"
          medicalProfile={medicalProfile}
        />
        <MedicalProfileField
          field="pastPrescriptionTopicalMedications"
          type="question"
          medicalProfile={medicalProfile}
        />
        <MedicalProfileField
          field="currentPrescriptionOralMedications"
          type="question"
          medicalProfile={medicalProfile}
        />
        <MedicalProfileField
          field="pastPrescriptionOralMedications"
          type="question"
          medicalProfile={medicalProfile}
        />
        <MedicalProfileField
          field="currentNonprescriptionTopicalMedications"
          type="question"
          medicalProfile={medicalProfile}
        />
        <MedicalProfileField
          field="pastNonprescriptionTopicalMedications"
          type="question"
          medicalProfile={medicalProfile}
        />
      </div>
    );
  }

  private renderSkinForm() {
    const {medicalProfile} = this.state.customer;

    return (
      <div>
        <SkinConcernsField field="skinConcerns" medicalProfile={medicalProfile} />
        <SkinTypeField field="skinType" medicalProfile={medicalProfile} />
        <PreferredFragranceField field="preferredFragrance" medicalProfile={medicalProfile} />
        <SunscreenFrequencyField field="sunscreenFrequency" medicalProfile={medicalProfile} />
        <MedicalProfileField field="usingPeels" type="question" medicalProfile={medicalProfile} />
        <MedicalProfileField field="usingRetinol" type="question" medicalProfile={medicalProfile} />

        <MedicalProfileField
          field="userSkinExtraDetails"
          type="text"
          medicalProfile={medicalProfile}
        />
      </div>
    );
  }

  private renderSubscriptionPanel() {
    return (
      <StripeElements
        fonts={[
          {
            family: "lasiver",
            src: `url("${require("!!url-loader!assets/fonts/lasiver/lasiverMedium.woff")}")`,
            style: "normal",
            unicodeRange: "U+000D-FEFF",
            weight: "400",
          },
        ]}
      >
        <SubscriptionPanel subscription={this.state.customer.subscription} />
      </StripeElements>
    );
  }

  private renderForm() {
    return (
      <Dialog isOpen={this.state.isOpen} onClose={this.toggleForm} title="Update profile">
        <form onSubmit={this.handleSubmit}>
          <div className="pt-dialog-body">
            <Tabs id="formSections" className="pt-large">
              <Tab
                id="contactInformationTab"
                title="Contact information"
                panel={this.renderContactForm()}
              />
              <Tab
                id="subscriptionTab"
                title="Subscription"
                panel={this.renderSubscriptionPanel()}
              />
              <Tab
                id="medicalHistoryTab"
                title="Medical history"
                panel={this.renderMedicalForm()}
              />
              <Tab id="skinProfileTab" title="Skin profile" panel={this.renderSkinForm()} />
              <Tab id="regimenTab" title="Regimen" panel={<RegimenPanel />} />
            </Tabs>

            <FadeTransitionGroup>{this.renderError()}</FadeTransitionGroup>
          </div>

          <div className="pt-dialog-footer">
            <div className="pt-dialog-footer-actions">
              <Button onClick={this.toggleForm}>Cancel</Button>
              <Button
                onClick={this.handleSubmit}
                loading={this.state.isLoading}
                className="pt-intent-primary"
                type="submit"
              >
                Update profile
              </Button>
            </div>
          </div>
        </form>
      </Dialog>
    );
  }

  public render() {
    return (
      <div className={[styles.wrapper, this.props.className].join(" ")}>
        <Button className="pt-large pt-intent-primary" iconName="user" onClick={this.toggleForm}>
          Update your profile
        </Button>

        <RiseTransitionGroup>{this.renderForm()}</RiseTransitionGroup>
      </div>
    );
  }
}
