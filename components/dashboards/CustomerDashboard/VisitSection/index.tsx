import {inject, observer} from "mobx-react";
import * as moment from "moment";
import * as React from "react";
import {Elements as StripeElements} from "react-stripe-elements";

import {Customer, Visit} from "models";
import {IdentityStore} from "stores";

import {TextWithNewlines} from "components/common";
import {PhotosCard} from "components/customers";
import {OrderForm} from "./OrderForm";

import * as styles from "./index.css";

const AMOUNT_PRECISION = 3;

interface Props {
  wasPrevious?: boolean;
  visit: Visit;
  className?: string;
  identityStore?: IdentityStore;
}
interface State {}

@inject("identityStore")
@observer
export class VisitSection extends React.Component<Props, State> {
  public static defaultProps = {
    wasPrevious: false,
  };

  private renderOrderForm() {
    const {status} = this.props.visit;
    const customer = this.props.identityStore!.currentIdentity!.user as Customer;
    const {subscription} = customer;

    if (subscription.hasPaymentSource || status !== "needs payment") {
      return;
    }

    const message = (
      <p>
        Purchase your formulation and treat yourself to a <strong>full 60 days</strong> of skin
        rejuvenation.
      </p>
    );

    return (
      <div>
        {message}

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
          <OrderForm subscription={subscription} />
        </StripeElements>
      </div>
    );
  }

  private renderDiagnosis() {
    const {diagnosis} = this.props.visit;

    if (!diagnosis) return;

    return (
      <div>
        <h3>
          Your diagnosis
          <span className={styles.diagnosisDate}>
            Created at {moment(diagnosis.createdAt).format("M/D/YYYY")}
          </span>
        </h3>
        <p>Between your photos and notes, I’ve made the following diagnoses:</p>
        <ul>
          {diagnosis.diagnosisConditions.map(diagnosisCondition => (
            <li key={diagnosisCondition.condition.id} className={styles.diagnosisConditionItem}>
              {diagnosisCondition.condition.name}
              <span>{diagnosisCondition.description}</span>
            </li>
          ))}
        </ul>

        <h3>Specific notes</h3>
        <p>
          <TextWithNewlines text={diagnosis.note} />
        </p>
      </div>
    );
  }

  private renderPlan() {
    const {visit} = this.props;

    if (visit.status === "needs photos") {
      if (visit.isFirst) {
        return (
          <p>
            Say cheese! Your EllaMD dermatologist is requesting your photos to finalize your
            personalized treatment plan!
          </p>
        );
      } else {
        return (
          <p>
            Say cheese! Your EllaMD dermatologist is requesting updated photos to finalize your
            updated personalized treatment plan!
          </p>
        );
      }
    }

    if (visit.status === "needs payment") return;

    if (visit.status === "needs prescription") {
      if (visit.isFirst) {
        return (
          <p>
            The doctor is currently reviewing your file, so your treatment plan will be on its way
            shortly! You’ll receive an email confirmation within 48 hours.
          </p>
        );
      } else {
        return (
          <p>
            The doctor is currently reviewing your file, so your updated treatment plan will be on
            its way shortly! You’ll receive an email confirmation within 48 hours.
          </p>
        );
      }
    }

    const prescription = visit.prescription;
    const photos = visit.photos;

    if (!prescription) return;

    return (
      <div className={styles.plan}>
        <div>
          <PhotosCard photos={photos} />
        </div>

        <div className={styles.columns}>
          <div>
            <p>Nice to meet you, {visit.customer.firstName}!</p>
            <p>
              <TextWithNewlines text={prescription.customerInstructions} />
            </p>

            {this.renderDiagnosis()}
          </div>

          <div>
            <h3>Your custom formulation</h3>
            {prescription.prescriptionIngredients.map(prescriptionIngredient => (
              <div className={styles.ingredient} key={prescriptionIngredient.ingredient.id}>
                <span className={styles.name}>{prescriptionIngredient.ingredient.name}, </span>
                <span className={styles.amount}>
                  {prescriptionIngredient.amount.toFixed(AMOUNT_PRECISION)}
                  {prescriptionIngredient.ingredient.unit}
                </span>
                <span className={styles.description}>
                  {prescriptionIngredient.ingredient.description}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  public render() {
    return (
      <div className={this.props.className}>
        <h2>
          {this.props.wasPrevious
            ? "Your previous treatment plan"
            : "Your personalized treatment plan"}
        </h2>

        {this.renderOrderForm()}
        {this.renderPlan()}
      </div>
    );
  }
}
