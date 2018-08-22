import {inject, observer} from "mobx-react";
import * as React from "react";

import {Customer, Diagnosis, Prescription, Regimen, Visit} from "models";
import {IdentityStore} from "stores";

import {PhotoConditions} from "./PhotoConditions";

import * as storyStyles from "../../index.css";
import * as styles from "./index.css";

interface Props {
  identityStore?: IdentityStore;
  visit: Visit;
}

@inject("identityStore")
@observer
export class VisitStoryItem extends React.Component<Props> {
  public render() {
    const {visit} = this.props;
    const customer = this.props.identityStore!.currentIdentity!.user as Customer;
    const name = customer.fullName;

    const updatedStuff = !!visit.prescription
      ? "formulation"
      : !!visit.regimen ? "regimen" : "diagnosis";

    return (
      <div className={styles.container}>
        <h1>
          I’ve updated your {updatedStuff}, {name}!
        </h1>

        {this.renderDiagnosis(visit.diagnosis)}
        {this.renderPrescription(visit.prescription)}
        {this.renderRegimen(visit.regimen)}

        <div className={storyStyles.signature}>
          <div>
            <span>Dr. Patrick Blake, M.D.</span>
            <img src={customer.physician.signatureImageUrl} />
          </div>
        </div>
      </div>
    );
  }

  private renderDiagnosis(diagnosis?: Diagnosis) {
    if (!diagnosis) {
      return;
    }

    return (
      <div>
        <h2>
          <span>Your diagnosis</span>
        </h2>
        <p>{diagnosis.note}</p>

        <PhotoConditions visit={this.props.visit} />
      </div>
    );
  }

  private renderPrescription(prescription?: Prescription) {
    if (!prescription) {
      return;
    }

    return (
      <div>
        <h2>
          <span>Your prescription</span>
        </h2>

        <p>{prescription.customerInstructions}</p>

        <div className={styles.prescriptionIngredients}>
          {prescription.prescriptionIngredients.map(pi => (
            <div key={pi.ingredient.id} className={styles.prescriptionIngredient}>
              <div className={styles.wrapper}>
                <div className={styles.ingredient}>
                  <span className={styles.amount}>
                    {pi.amount}
                    {pi.ingredient.unit}
                  </span>
                  <span className={styles.name}>{pi.ingredient.name}</span>
                </div>
                <div className={styles.description}>{pi.ingredient.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  private renderRegimen(regimen?: Regimen) {
    if (!regimen) {
      return;
    }

    return (
      <div>
        <h2>
          <span>Your regimen</span>
        </h2>

        <div className={styles.columns}>
          <div>
            <h3>In the morning</h3>
            {regimen
              .periodRegimenProducts("am")
              .sort((p1, p2) => p1.position - p2.position)
              .map(p => (
                <div key={p.id} className={styles.product}>
                  <span className={styles.name}>{p.product.name}</span>
                  <span className={styles.brand}>{p.product.brand}</span>
                </div>
              ))}
          </div>
          <div>
            <h3>In the evening</h3>
            {regimen
              .periodRegimenProducts("pm")
              .sort((p1, p2) => p1.position - p2.position)
              .map(p => (
                <div key={p.id} className={styles.product}>
                  <span className={styles.name}>{p.product.name}</span>
                  <span className={styles.brand}>{p.product.brand}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  }
}
