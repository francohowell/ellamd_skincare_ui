import * as React from "react";

import {TextWithNewlines} from "components/common";
import {Prescription} from "models";

import * as styles from "./index.css";

const AMOUNT_PRECISION = 3;

interface Props {
  prescription: Prescription;
}
interface State {}

export class PrescriptionCard extends React.Component<Props, State> {
  private prescriptionStatus() {
    const {prescription} = this.props;

    if (!prescription.shouldShowToPharmacists) {
      return "Waiting for payment";
    }

    if (!prescription.fulfilledAt) {
      return "Processing (PDF sent)";
    }

    if (!prescription.trackingNumber) {
      return "In progress (PDF received)";
    }

    return "Mailed";
  }

  public render() {
    const {prescription} = this.props;

    return (
      <div className={styles.prescription}>
        <h4>Order status</h4>
        <p>
          {this.prescriptionStatus()}
        </p>

        <h4>Formulation</h4>
        <p>
          {prescription.formulation
            ? `[${prescription.formulation.number}] ${prescription.formulation.mainTag}`
            : "CUSTOM"}
        </p>

        <div className={styles.ingredients}>
          {prescription.prescriptionIngredients.map(prescriptionIngredient =>
            <span className={styles.ingredient} key={prescriptionIngredient.ingredient.name}>
              <span className={styles.amount}>
                {prescriptionIngredient.amount.toFixed(AMOUNT_PRECISION)}
              </span>
              <span className={styles.unit}>
                {prescriptionIngredient.ingredient.unit}
              </span>
              <span className={styles.name}>
                {prescriptionIngredient.ingredient.name}
              </span>
            </span>
          )}
        </div>

        <h4>Sig.</h4>
        <p>
          {prescription.signa}
        </p>

        <h4>Note/instructions for customer</h4>
        <p>
          <TextWithNewlines text={prescription.customerInstructions} />
        </p>

        <h4>Note/instructions for pharmacist</h4>
        <p>
          <TextWithNewlines text={prescription.pharmacistInstructions} />
        </p>

        <h4>Cream base</h4>
        <p>
          {prescription.creamBase}
        </p>

        <h4>Fragrance</h4>
        <p>
          {prescription.fragrance}
        </p>

        <h4>Volume</h4>
        <p>
          {prescription.volumeInMl}mL
        </p>
      </div>
    );
  }
}
