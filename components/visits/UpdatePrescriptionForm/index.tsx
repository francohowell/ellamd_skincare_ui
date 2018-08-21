import {Button, Dialog, Intent} from "@blueprintjs/core";
import {computed} from "mobx";
import {inject, observer} from "mobx-react";
import * as moment from "moment";
import * as React from "react";

import {
  CollapsibleSection,
  FadeTransitionGroup,
  RiseTransitionGroup,
  Spinner,
} from "components/common";
import {
  CreamBase,
  Customer,
  FormulationIngredient,
  Fragrance,
  Photo,
  PrescriptionIngredient,
  Visit,
} from "models";
import {CustomerStore, FormulationStore, IngredientStore} from "stores";
import {Method, request, Status, SubmitEvent, Toaster} from "utilities";

import * as styles from "./index.css";

const DEFAULT_SIGNA =
  "Apply 2 pumps squeezes or .5ml to entire face every night at bedtime, ideally 15 minutes after washing face.";

interface Props {
  customer: Customer;
  visit: Visit;
  className?: string;
  customerStore?: CustomerStore;
  ingredientStore?: IngredientStore;
  formulationStore?: FormulationStore;
}

interface State {
  isDialogOpen: boolean;
  prescriptionIngredients: PrescriptionIngredient[];
  signa: string;
  customerInstructions: string;
  pharmacistInstructions: string;
  creamBase: CreamBase;
  fragrance: Fragrance;
  hasError: boolean;
  errorMessage?: string;
  isLoading: boolean;
  volumeInMl: number;
}

class Store {
  private props: Props;

  constructor(props: Props) {
    this.props = props;
  }

  @computed
  get isLoading(): boolean {
    return this.props.formulationStore!.isLoading || this.props.ingredientStore!.isLoading;
  }
}

const DEFAULT_STATE: State = {
  isDialogOpen: false,
  prescriptionIngredients: [],
  signa: DEFAULT_SIGNA,
  customerInstructions: "",
  pharmacistInstructions: "",
  creamBase: "hrt",
  fragrance: "no_scent",
  hasError: false,
  errorMessage: undefined,
  isLoading: false,
  volumeInMl: 30,
};

@inject("customerStore", "ingredientStore", "physicianStore", "formulationStore")
@observer
export class UpdatePrescriptionForm extends React.Component<Props, State> {
  public store: Store;
  public state: State = DEFAULT_STATE;

  constructor(props: Props, context: any) {
    super(props, context);
    this.store = new Store(props);
  }

  public componentDidUpdate(_prevProps: Props, prevState: State) {
    const {customer: {medicalProfile}, visit: {prescription}} = this.props;

    if (!prevState.isDialogOpen && this.state.isDialogOpen) {
      this.setState({
        fragrance: medicalProfile.preferredFragrance || "no_scent",
        customerInstructions: prescription ? prescription.customerInstructions : "",
        pharmacistInstructions: prescription ? prescription.pharmacistInstructions : "",
        signa: prescription ? prescription.signa : DEFAULT_SIGNA,
      });
    }
  }

  private toggleDialog = () => {
    this.setState({isDialogOpen: !this.state.isDialogOpen});
  };

  private renderPhoto(photo: Photo) {
    return (
      <a
        className={["pt-card", "pt-interactive", styles.photo].join(" ")}
        key={photo.id}
        href={photo.largeUrl}
        target="_blank"
      >
        <img src={photo.thumbnailUrl} />

        <span className={styles.date}>{moment(photo.createdAt).format("M/D/YYYY")}</span>
      </a>
    );
  }

  private renderPhotos() {
    if (this.props.customer.photos.length === 0) {
      return;
    }

    return (
      <div className={styles.photos}>
        {this.props.customer.photos.slice(0, 5).map(photo => this.renderPhoto(photo))}

        <CollapsibleSection
          title="Previous photos"
          count={Math.max(this.props.customer.photos.length - 5, 0)}
        >
          <div>{this.props.customer.photos.slice(5).map(photo => this.renderPhoto(photo))}</div>
        </CollapsibleSection>
      </div>
    );
  }

  private handleIngredientChange = (ingredientId: number, event: any) => {
    const {prescriptionIngredients} = this.state;
    const amount = (event.target as any).value;

    const existingPrescriptionIngredient = prescriptionIngredients.find(
      prescriptionIngredient => prescriptionIngredient.ingredient.id === ingredientId
    );

    if (existingPrescriptionIngredient) {
      existingPrescriptionIngredient.amount = amount;
    } else {
      prescriptionIngredients.push({
        ingredient: this.props.ingredientStore!.getIngredientById(ingredientId)!,
        amount,
      });
    }

    this.setState({prescriptionIngredients, hasError: false});
  };

  private handleSignaChange = (event: React.FormEvent<HTMLTextAreaElement>) => {
    this.setState({signa: (event.target as any).value, hasError: false});
  };

  private handleCustomerInstructionsChange = (event: React.FormEvent<HTMLTextAreaElement>) => {
    this.setState({customerInstructions: (event.target as any).value, hasError: false});
  };

  private handlePharmacistInstructionsChange = (event: React.FormEvent<HTMLTextAreaElement>) => {
    this.setState({pharmacistInstructions: (event.target as any).value, hasError: false});
  };

  private handleCreamBaseChange = (event: React.FormEvent<HTMLSelectElement>) => {
    this.setState({creamBase: (event.target as any).value, hasError: false});
  };

  private handleFragranceChange = (event: React.FormEvent<HTMLSelectElement>) => {
    this.setState({fragrance: (event.target as any).value, hasError: false});
  };

  private handleVolumeInMlChange = (event: React.FormEvent<HTMLSelectElement>) => {
    this.setState({volumeInMl: (event.target as any).value, hasError: false});
  };

  private handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();
    const {
      prescriptionIngredients,
      signa,
      customerInstructions,
      pharmacistInstructions,
      creamBase,
      fragrance,
      volumeInMl,
    } = this.state;

    this.setState({isLoading: true, hasError: false});
    const response = await request(`visits/${this.props.visit.id}/prescription`, Method.POST, {
      prescriptionIngredients,
      signa,
      customerInstructions,
      pharmacistInstructions,
      creamBase,
      fragrance,
      volumeInMl,
      formulationId: this.currentFormulationId() > 0 ? this.currentFormulationId() : undefined,
    });
    this.setState({isLoading: false});

    // tslint:disable-next-line switch-default
    switch (response.status) {
      case Status.Success:
        const {visit} = response.data! as {visit: Visit};

        this.props.customer.updateVisit(visit);
        Toaster.show({
          message: "Prescription updated.",
          intent: Intent.SUCCESS,
          iconName: "tick",
        });
        this.setState(DEFAULT_STATE);
        break;

      case Status.Error:
        this.setState({hasError: true, errorMessage: response.error});
        break;
    }
  };

  private renderError() {
    if (!this.state.hasError) {
      return;
    }

    return (
      <div className={styles.errorWrapper}>
        <div className={styles.error}>{this.state.errorMessage}</div>
      </div>
    );
  }

  private renderIngredientsString(
    formulationOrPrescriptionIngredients: PrescriptionIngredient[] | FormulationIngredient[]
  ) {
    return formulationOrPrescriptionIngredients
      .sort((a, b) => a.ingredient.id - b.ingredient.id)
      .map(
        ingredientElement =>
          `${ingredientElement.amount}${ingredientElement.ingredient.unit}` +
          " " +
          ingredientElement.ingredient.name
      )
      .join(", ");
  }

  private currentFormulationId() {
    const {formulations} = this.props.formulationStore!;

    if (formulations === undefined) {
      return -1;
    }

    const currentString = this.renderIngredientsString(this.state.prescriptionIngredients);

    const matchingFormulation = formulations.find(
      formulation =>
        this.renderIngredientsString(formulation.formulationIngredients) === currentString
    );

    return matchingFormulation ? matchingFormulation.id : -1;
  }

  private handleFormulationChange = (event: React.FormEvent<HTMLSelectElement>) => {
    const formulationId = parseInt((event.target as any).value, 10);
    const formulation = this.props.formulationStore!.getFormulationById(formulationId);

    if (formulation) {
      this.setState({
        prescriptionIngredients: formulation.formulationIngredients.map(formulationIngredient => ({
          ingredient: formulationIngredient.ingredient,
          amount: formulationIngredient.amount,
        })),
        creamBase: formulation.creamBase,
      });
    }
  };

  public render() {
    return (
      <div className={[styles.wrapper, this.props.className].join(" ")}>
        <Button className="pt-intent-primary pt-large" onClick={this.toggleDialog}>
          Update prescription
        </Button>

        <RiseTransitionGroup>{this.renderDialog()}</RiseTransitionGroup>
      </div>
    );
  }

  private renderDialog() {
    if (!this.state.isDialogOpen) {
      return;
    }

    return (
      <Dialog isOpen={this.state.isDialogOpen} onClose={this.toggleDialog} title="New prescription">
        {this.renderForm()}
      </Dialog>
    );
  }

  private renderForm() {
    if (this.store.isLoading) {
      return <Spinner title="Loading prescription form..." />;
    }

    const {formulations} = this.props.formulationStore!;
    const {ingredients} = this.props.ingredientStore!;

    return (
      <form onSubmit={this.handleSubmit}>
        <div className="pt-dialog-body">
          {this.props.visit.paymentStatus === "unpaid_with_free_treatment_plan" ? (
            <div className={["pt-callout", "pt-intent-warning", styles.warning].join(" ")}>
              This customer has not yet paid for this prescription; it will not be shown to the
              pharmacists until the customer has paid for it.
            </div>
          ) : (
            undefined
          )}

          {this.renderPhotos()}

          <label className="pt-label">
            Formulation
            <span className="pt-select pt-large">
              <select onChange={this.handleFormulationChange} value={this.currentFormulationId()}>
                <option value={-1}>CUSTOM</option>

                <option disabled={true}>Pre-made formulations:</option>
                {formulations !== undefined
                  ? formulations.map(formulation => (
                      <option value={formulation.id} key={formulation.id}>
                        [{formulation.number}] {formulation.mainTag}
                      </option>
                    ))
                  : undefined}
              </select>
            </span>
          </label>

          <CollapsibleSection
            title="Ingredients"
            className={styles.ingredientsWrapper}
            count={this.renderIngredientsString(this.state.prescriptionIngredients)}
          >
            <div className={styles.ingredients}>
              {ingredients !== undefined
                ? ingredients.map(ingredient => (
                    <label
                      key={ingredient.id}
                      className={[styles.ingredient, "pt-label"].join(" ")}
                    >
                      <span className={styles.range}>
                        {ingredient.minimumAmount} – {ingredient.maximumAmount}
                        {ingredient.unit}
                      </span>

                      {ingredient.name}
                      <input
                        type="text"
                        className="pt-input pt-small pt-fill"
                        onChange={this.handleIngredientChange.bind(this, ingredient.id)}
                        value={
                          this.state.prescriptionIngredients.find(
                            prescriptionIngredient =>
                              prescriptionIngredient.ingredient.id === ingredient.id
                          )
                            ? this.state.prescriptionIngredients.find(
                                prescriptionIngredient =>
                                  prescriptionIngredient.ingredient.id === ingredient.id
                              )!.amount
                            : ""
                        }
                      />
                    </label>
                  ))
                : undefined}
            </div>
          </CollapsibleSection>

          <label className="pt-label">
            Note/instructions for customer
            <textarea
              onChange={this.handleCustomerInstructionsChange}
              value={this.state.customerInstructions}
              className={["pt-input", "pt-fill", styles.customerInstructions].join(" ")}
            />
          </label>

          <label className="pt-label">
            Sig.
            <textarea
              className="pt-input pt-fill"
              onChange={this.handleSignaChange}
              value={this.state.signa}
            />
          </label>

          <label className="pt-label">
            Note/instructions for pharmacist
            <textarea
              onChange={this.handlePharmacistInstructionsChange}
              value={this.state.pharmacistInstructions}
              className="pt-input pt-fill"
            />
          </label>

          <div className={styles.columns}>
            <label className="pt-label">
              Volume
              <span className="pt-select">
                <select onChange={this.handleVolumeInMlChange} value={this.state.volumeInMl}>
                  <option value={15}>15mL</option>
                  <option value={20}>20mL</option>
                  <option value={30}>30mL</option>
                </select>
              </span>
            </label>

            <label className="pt-label">
              Cream base
              <span className="pt-select">
                <select onChange={this.handleCreamBaseChange} value={this.state.creamBase}>
                  <option value="hrt">HRT</option>
                  <option value="anhydrous">Anhydrous</option>
                </select>
              </span>
            </label>

            <label className="pt-label">
              Fragrance
              <span className="pt-select">
                <select onChange={this.handleFragranceChange} value={this.state.fragrance}>
                  <option value="no_scent">No scent</option>
                  <option value="rose_hip">Rose hip</option>
                  <option value="eucalyptus">Eucalyptus</option>
                </select>
              </span>
            </label>
          </div>

          <FadeTransitionGroup>{this.renderError()}</FadeTransitionGroup>
        </div>

        <div className="pt-dialog-footer">
          <div className="pt-dialog-footer-actions">
            <Button onClick={this.toggleDialog}>Cancel</Button>

            <Button
              onClick={this.handleSubmit}
              className="pt-intent-primary"
              loading={this.state.isLoading}
              type="submit"
            >
              Update prescription
            </Button>
          </div>
        </div>
      </form>
    );
  }
}
