import {Button, Intent, ProgressBar} from "@blueprintjs/core";
import {action, observable, toJS} from "mobx";
import {inject, observer} from "mobx-react";
import * as React from "react";
import {injectStripe, ReactStripeElements as RSE} from "react-stripe-elements";

import {CustomersApi} from "apis";
import {RegimenForm} from "components/regimens";
import {Customer, StripeError, StripeSuccess} from "models";
import {CustomerStore, IdentityStore, SubscriptionStore} from "stores";
import {history, ROUTES, SubmitEvent, Toaster, uploadPhotos, UploadResponse} from "utilities";

import {FadeTransitionGroup} from "components/common";
import {PhotosField} from "components/customers";

import {PaymentStep} from "./PaymentStep";
import {SkinStep} from "./SkinStep";

import * as styles from "./index.css";

// TODO: This component is in major need of refactoring. See the notes in the top-level JSDoc
//   comment on the component below for more details.

type Step = 1 | 2 | 3 | 4;

interface Props {
  className?: string;
  identityStore?: IdentityStore;
  customerStore?: CustomerStore;
  subscriptionStore?: SubscriptionStore;
  stripe?: RSE.StripeProps;
}

interface State {
  isLoading: boolean;
  errorMessage?: string;
  step: Step;
  files: File[];
  uploadProgress?: number;
}

export const STEP_COUNT = 4;
const STEP_PATHS = ["skincare-details", "regimen", "photos", "order-information"];
const SCROLL_OFFSET_IN_PIXELS = 100;

/**
 * The OnboardingForm is the entire onboarding flow in one self-contained component.
 *
 * TODO: This component is a bit of a mess. Once iteration on this component's design and
 *   functionality has finished and their implementations have stabilized, it should be broken up,
 *   refactored, and DRYed up as much as possible.
 */

@inject("identityStore", "customerStore", "subscriptionStore")
@observer
class WrappedOnboardingForm extends React.Component<Props, State> {
  public state: State = {
    isLoading: false,
    errorMessage: undefined,
    step: 1,
    files: [],
  };

  private initialCustomerForStep: Customer;

  @observable private customer: Customer;

  public componentWillMount() {
    const identity = this.props.identityStore!.currentIdentity;

    if (identity && identity.userType === "Customer") {
      const customer = identity.user as Customer;
      this.setCustomer(customer);

      // Clamp the last step to between 1 and STEP_COUNT.
      const step = Math.max(1, Math.min(STEP_COUNT, customer.lastOnboardingStep)) as Step;
      this.setStep(step);
    } else {
      throw new Error("An issue has occurred creating your account");
    }
  }

  private setStep(step: Step) {
    history.push(`${ROUTES.onboarding}/${STEP_PATHS[step - 1]}`);
    if (typeof window !== "undefined") {
      window.scrollTo(0, SCROLL_OFFSET_IN_PIXELS);
    }

    this.initialCustomerForStep = observable(toJS(this.customer));
    this.setState({step});
  }

  @action
  private setCustomer = (customer: Customer) => {
    this.customer = customer;
  };

  private handleFilesChange = (files: File[]) => {
    this.setState({files});
  };

  private handleNext = async (event: SubmitEvent) => {
    if (this.state.isLoading) {
      return;
    }

    event.preventDefault();
    const {step} = this.state;

    const submittedSuccessfully = await this.submitProfile(
      step === STEP_COUNT ? STEP_COUNT : step + 1
    );
    if (!submittedSuccessfully) return;

    if (step < STEP_COUNT) {
      this.setStep((step + 1) as Step);
    } else if (step === STEP_COUNT) {
      const submittedPaymentSuccessfully = await this.submitPayment();

      if (submittedPaymentSuccessfully) {
        await this.submitProfile(STEP_COUNT + 1, true);
        Toaster.show({
          message:
            "Congratulations! Your profile has been created and submitted to your dermatologist.",
          intent: Intent.SUCCESS,
          iconName: "tick",
        });
        this.props.identityStore!.setShowThankYouDialog(true);
        this.props.identityStore!.replaceUser(this.customer);
        history.push(ROUTES.dashboard);
      }
    }
  };

  private handleBack = async () => {
    if (this.state.isLoading) return;

    const submittedSuccessfully = await this.submitProfile(this.state.step - 1, false, true);
    if (!submittedSuccessfully) return;

    this.setStep((this.state.step - 1) as Step);
  };

  private handleSubmitProgress = (uploadProgress?: number) => {
    if (uploadProgress) this.setState({uploadProgress});
  };

  private renderProgressBar() {
    if (!this.state.uploadProgress) return;

    const value = this.state.uploadProgress;

    return <ProgressBar value={value} />;
  }

  private renderBackButton() {
    if (this.state.step === 1) return;

    return (
      <Button
        className={["pt-large", styles.submit, styles.backButton].join(" ")}
        loading={this.state.isLoading}
        iconName="arrow-left"
        onClick={this.handleBack}
      >
        Back
      </Button>
    );
  }

  private submitProfile = async (
    nextStep: number,
    finalSubmission: boolean = false,
    useInitialCustomerForStep: boolean = false
  ) => {
    this.setState({errorMessage: undefined});

    let customer = useInitialCustomerForStep ? this.initialCustomerForStep : this.customer;

    try {
      this.setState({isLoading: true});
      customer = await CustomersApi.update(customer, {
        lastOnboardingStep: nextStep,
        initialSignup: finalSubmission,
      });
      this.props.customerStore!.replaceCustomer(customer);
      this.setCustomer(customer);
      this.setState({isLoading: false});
    } catch (error) {
      this.setState({isLoading: false, errorMessage: error.message});
      return false;
    }

    if (this.state.files.length > 0) {
      const formData = new FormData();
      this.state.files.forEach(file => {
        formData.append("images[]", file);
      });

      this.setState({isLoading: true, errorMessage: undefined});

      const upload = uploadPhotos(`customers/${customer.id}/photos/create`, formData);

      upload.onProgress(this.handleSubmitProgress);

      try {
        const {photos} = (await upload.start()) as UploadResponse;

        customer.addPhotos(photos);

        this.setState({isLoading: false, files: []});
      } catch (err) {
        this.setState({
          isLoading: false,
          errorMessage: "An error ocurred trying to upload images. Please try again later",
        });
      }
    }

    return true;
  };

  private submitPayment = async () => {
    const {subscription} = this.customer;

    if (subscription.initialTreatmentPlanIsFree || subscription.isActive) {
      return true;
    }

    this.setState({isLoading: true});

    try {
      const stripeResult = await this.props.stripe!.createToken();

      if ((stripeResult as StripeSuccess).token === undefined) {
        this.setState({
          isLoading: false,
          errorMessage: (stripeResult as StripeError).error.message,
        });

        return false;
      }

      const stripeToken = (stripeResult as StripeSuccess).token.id;
      await this.props.subscriptionStore!.startSubscription(subscription, stripeToken);
      this.setState({isLoading: false});

      return true;
    } catch (error) {
      this.setState({isLoading: false});

      Toaster.show({
        message: error.message,
        intent: Intent.WARNING,
        iconName: "warning-sign",
      });

      return false;
    }
  };

  private renderError() {
    if (!this.state.errorMessage) return;

    return (
      <div className={styles.errorWrapper}>
        {this.state.errorMessage.split("; ").map((message, index) => (
          <div className="pt-callout pt-intent-danger pt-icon-cross" key={index}>
            {message}
          </div>
        ))}
      </div>
    );
  }

  private renderSteps() {
    const {step} = this.state;

    return (
      <ul className={styles.steps}>
        <li className={step === 1 ? styles.active : undefined}>
          <span className={styles.number}>1</span>
          Skin<br />profile
        </li>

        <li className={styles.arrow}>→</li>
        <li className={step === 2 ? styles.active : undefined}>
          <span className={styles.number}>2</span>
          Regimen
        </li>

        <li className={styles.arrow}>→</li>
        <li className={step === 3 ? styles.active : undefined}>
          <span className={styles.number}>3</span>
          Photos
        </li>

        <li className={styles.arrow}>→</li>
        <li className={step === 4 ? styles.active : undefined}>
          <span className={styles.number}>4</span>
          Order<br />information
        </li>
      </ul>
    );
  }

  private renderForm() {
    const {step} = this.state;

    if (step === 1) {
      return <SkinStep medicalProfile={this.customer.medicalProfile} />;
    }

    if (step === 2) {
      return (
        <RegimenForm
          regimen={this.customer.actualRegimen}
          allowNewProducts={true}
          withIngredients={false}
        />
      );
    }

    if (step === 3) {
      return (
        <div>
          <PhotosField
            customer={this.customer}
            files={this.state.files}
            onChange={this.handleFilesChange}
          />

          {this.renderProgressBar()}
        </div>
      );
    }

    if (step === 4) {
      return <PaymentStep customer={this.customer} />;
    }

    return;
  }

  private renderHeading(step: Step) {
    switch (step) {
      case 1:
        return "Getting skin deep";
      case 2:
        return "Your regimen";
      case 3:
        return "Upload photos";
      case 4:
        return "Just one more thing…";
    }
  }

  public render() {
    return (
      <form className={styles.onboardingForm} onSubmit={this.handleNext}>
        <div className={styles.headingAndSteps}>
          <h2 className={styles.heading}>{this.renderHeading(this.state.step)}</h2>

          {this.renderSteps()}
        </div>

        {this.renderForm()}

        <FadeTransitionGroup>{this.renderError()}</FadeTransitionGroup>

        <div className={styles.actions}>
          {this.renderBackButton()}

          <Button
            className={["pt-intent-primary", "pt-large", styles.submit].join(" ")}
            loading={this.state.isLoading}
            rightIconName="arrow-right"
            onClick={this.handleNext}
            type="submit"
          >
            {this.state.step === STEP_COUNT ? "Finish" : "Next"}
          </Button>
        </div>
      </form>
    );
  }
}

// tslint:disable-next-line variable-name
export const OnboardingForm = injectStripe(WrappedOnboardingForm);
