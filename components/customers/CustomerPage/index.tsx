import {Button} from "@blueprintjs/core";
import {action, observable, runInAction} from "mobx";
import {observer} from "mobx-react";
import * as React from "react";
import {RouteComponentProps} from "react-router-dom";

import {CustomersApi} from "apis";
import {Spinner} from "components/common";
import {ArchiveCustomerForm, UpdateCustomerForm} from "components/customers";
import {RegimenBlock} from "components/regimens";
import {notifySuccess, notifyWarning} from "lib";
import {Customer, Id} from "models";

import {ContactInformationSection} from "./ContactInformationSection";
import {HistorySection} from "./HistorySection";
import {PhotosSection} from "./PhotosSection";
import {SkinProfileSection} from "./SkinProfileSection";
import {VisitSection} from "./VisitSection";

export * from "./VisitSection";

import * as styles from "./index.css";

interface Props extends RouteComponentProps<any> {
  canArchive?: boolean;
  canEdit?: boolean;
  canCreatePhoto?: boolean;
  canCreatePrescription?: boolean;
  canDeletePrescription?: boolean;
  canCreateDiagnosis?: boolean;
}

class Store {
  @observable public isLoading: boolean = true;
  @observable public isUpdating: boolean = false;
  @observable public customer?: Customer;

  private customerId: Id;

  constructor(customerId: Id) {
    this.customerId = customerId;
    this.fetchCustomer();
  }

  @action
  public async createVisit() {
    this.isUpdating = true;

    try {
      const customer = await CustomersApi.createVisit(this.customerId);
      this.setCustomer(customer);
      notifySuccess("Visit has been created");
    } catch (error) {
      notifyWarning(error.message);
    } finally {
      runInAction(() => {
        this.isUpdating = false;
      });
    }
  }

  @action
  private async fetchCustomer() {
    const customer = await CustomersApi.show(this.customerId);
    this.setCustomer(customer);

    runInAction(() => {
      this.isLoading = false;
    });
  }

  @action
  private setCustomer(customer: Customer): void {
    this.customer = customer;
  }
}

// TODO: render nice 404 page when customer has not been found
@observer
export class CustomerPage extends React.Component<Props> {
  public static defaultProps: Partial<Props> = {
    canArchive: true,
    canEdit: true,
    canCreatePhoto: true,
    canCreateDiagnosis: true,
    canCreatePrescription: true,
  };

  private store: Store;

  constructor(props: Props, context: any) {
    super(props, context);
    this.store = new Store(this.props.match.params.id);
  }

  public render() {
    if (this.store.isLoading) {
      return <Spinner title="Loading customer page..." />;
    }

    const {customer} = this.store;

    if (!customer) {
      return <div />;
    }

    return (
      <div>
        <section className={styles.page}>
          {this.renderActions(customer)}
          {this.renderIdentifiers(customer)}

          <div className={styles.columns}>
            <div className={styles.column}>
              <ContactInformationSection
                customer={customer}
                className={["pt-card", "pt-elevation-1", styles.section].join(" ")}
              />

              {this.renderPhysicianSection(customer)}

              <SkinProfileSection
                medicalProfile={customer.medicalProfile}
                className={["pt-card", "pt-elevation-1", styles.section].join(" ")}
              />
            </div>

            <div className={styles.column}>
              <HistorySection
                medicalProfile={customer.medicalProfile}
                className={["pt-card", "pt-elevation-1", styles.section].join(" ")}
              />
            </div>
          </div>

          <section className={`pt-card pt-elevation-1 ${styles.section}`}>
            <h3>Current regimen</h3>
            <RegimenBlock regimen={customer.actualRegimen} />
          </section>

          <PhotosSection
            customer={customer}
            canCreate={this.props.canCreatePhoto}
            className={["pt-card", "pt-elevation-1", styles.section].join(" ")}
          />
        </section>

        <div className={styles.page}>
          {customer.visits.map((visit, index) => (
            <VisitSection
              number={index + 1}
              key={visit.id}
              customer={customer}
              visit={visit}
              className={["pt-card", "pt-elevation-1", styles.section].join(" ")}
            />
          ))}
        </div>

        <Button
          className="pt-large pt-fill"
          onClick={() => this.store.createVisit()}
          loading={this.store.isUpdating}
        >
          Create new visit
        </Button>
      </div>
    );
  }

  private renderActions(customer: Customer) {
    return (
      <span className={styles.actions}>
        {this.props.canArchive ? <ArchiveCustomerForm customer={customer} /> : undefined}
        {this.props.canEdit ? <UpdateCustomerForm initialCustomer={customer} /> : undefined}
      </span>
    );
  }

  private renderIdentifiers(customer: Customer) {
    const {medicalProfile} = customer;

    return (
      <span className={styles.identifiers}>
        <h2 className={styles.heading}>
          {customer.firstName} {customer.lastName}
        </h2>

        <span className={styles.dateOfBirth}>
          {medicalProfile.dateOfBirth ? medicalProfile.dateOfBirth : "????-??-??"}
        </span>

        <span className={styles.sex}>{medicalProfile.sex ? medicalProfile.sex : "???"}</span>
      </span>
    );
  }

  private renderPhysicianSection(customer: Customer) {
    return (
      <section className={["pt-card", "pt-elevation-1", styles.section].join(" ")}>
        <h3>Physician</h3>

        <p>
          {customer.physician
            ? `${customer.physician.firstName} ${customer.physician.lastName}`
            : "Not assigned."}
        </p>
      </section>
    );
  }
}
