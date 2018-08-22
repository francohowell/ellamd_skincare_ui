import {inject, observer} from "mobx-react";
import * as React from "react";
import {Redirect, Route, Switch} from "react-router-dom";

import {
  ForgotPasswordForm,
  OnboardingPage,
  ResetPasswordForm,
  SignInForm,
  SignUpForm,
  STEP_COUNT as ONBOARDING_STEP_COUNT,
} from "components/app";
import {CustomerPage} from "components/customers";
import {
  AdministratorDashboard,
  CustomerDashboard,
  PharmacistDashboard,
  PhysicianDashboard,
} from "components/dashboards";
import {PrivacyPolicyPage, PrivacyPracticesPage, TermsOfUsePage} from "components/legal";
import {ProductSection} from "components/products";
import {Customer} from "models";
import {IdentityStore} from "stores";
import {NotFoundMessage, ServerErrorMessage} from "utilities";
import {ROUTES} from "utilities/routing/ROUTES";

interface Props {
  onServer: boolean;
  location: any;
  identityStore?: IdentityStore;
}

// We disable this rule because the route configuration is a lot cleaner when we can put the
// components straight into arrays.
//
// tslint:disable jsx-wrap-multiline

@inject("identityStore")
@observer
export class Router extends React.Component<Props> {
  private renderCommonRoutes() {
    return [
      <Route
        key="privacyPolicy"
        path={ROUTES.privacyPolicy}
        component={PrivacyPolicyPage}
        exact={true}
      />,
      <Route
        key="privacyPractices"
        path={ROUTES.privacyPractices}
        component={PrivacyPracticesPage}
        exact={true}
      />,
      <Route key="termsOfUse" path={ROUTES.termsOfUse} component={TermsOfUsePage} exact={true} />,
      <Route key="404" path={ROUTES.notFound} component={NotFoundMessage} exact={true} />,
      <Route key="500" path={ROUTES.serverError} component={ServerErrorMessage} exact={true} />,
      <Route key="*" component={NotFoundMessage} />,
    ];
  }

  private renderIdentityRoutes() {
    const currentIdentity = this.props.identityStore!.currentIdentity;

    if (currentIdentity && this.props.identityStore!.isSignedIn) {
      switch (currentIdentity!.userType) {
        case "Customer":
          return this.renderCustomerRoutes(currentIdentity!.user);
        case "Physician":
          return this.renderPhysicianRoutes();
        case "Pharmacist":
          return this.renderPharmacistRoutes();
        case "Administrator":
          return this.renderAdministratorRoutes();
      }
    }

    return this.renderGuestRoutes();
  }

  private renderGuestRoutes() {
    return [
      <Redirect key="dashboard" path={ROUTES.dashboard} to={ROUTES.signIn} exact={true} />,
      <Route key="signIn" path={ROUTES.signIn} component={SignInForm} exact={true} />,
      <Route key="signUp" path={ROUTES.signUp} component={SignUpForm} exact={true} />,
      <Route
        key="forgotPassword"
        path={ROUTES.forgotPassword}
        component={ForgotPasswordForm}
        exact={true}
      />,
      <Route
        key="resetPassword"
        path={ROUTES.resetPassword}
        component={ResetPasswordForm}
        exact={true}
      />,
      <Redirect key="root" path="/" to={ROUTES.signIn} exact={true} />,
    ];
  }

  private renderCustomerRoutes(customer: Customer) {
    let dashboardRoute;

    if (customer.lastOnboardingStep > ONBOARDING_STEP_COUNT) {
      dashboardRoute = (
        <Route key="dashboard" path={ROUTES.dashboard} component={CustomerDashboard} exact={true} />
      );
    } else {
      dashboardRoute = <Redirect key="dashboard" path={ROUTES.dashboard} to={ROUTES.onboarding} />;
    }

    return [
      <Redirect key="signIn" path={ROUTES.signIn} to={ROUTES.dashboard} exact={true} />,
      <Redirect key="signUp" path={ROUTES.signUp} to={ROUTES.dashboard} exact={true} />,
      <Route key="onboarding" path={ROUTES.onboarding} component={OnboardingPage} />,
      dashboardRoute,
      <Redirect key="root" path={ROUTES.home} to={ROUTES.dashboard} exact={true} />,
    ];
  }

  private renderPhysicianRoutes() {
    return [
      <Redirect key="signIn" path={ROUTES.signIn} to={ROUTES.dashboard} exact={true} />,
      <Route key="dashboard" path={ROUTES.dashboard} component={PhysicianDashboard} exact={true} />,
      <Route
        key="customersShow"
        path={ROUTES.customersShow}
        render={routeProps => (
          <CustomerPage
            canArchive={false}
            canEdit={false}
            canDeletePrescription={false}
            {...routeProps}
          />
        )}
        exact={true}
      />,
      <Redirect key="root" path={ROUTES.home} to={ROUTES.dashboard} exact={true} />,
    ];
  }
  private renderPharmacistRoutes() {
    return [
      <Redirect key="signIn" path={ROUTES.signIn} to={ROUTES.dashboard} exact={true} />,
      <Route
        key="dashboard"
        path={ROUTES.dashboard}
        component={PharmacistDashboard}
        exact={true}
      />,
      <Redirect key="root" path={ROUTES.home} to={ROUTES.dashboard} exact={true} />,
    ];
  }

  private renderAdministratorRoutes() {
    return [
      <Redirect key="signIn" path={ROUTES.signIn} to={ROUTES.dashboard} exact={true} />,
      <Route
        key="dashboard"
        path={ROUTES.dashboard}
        component={AdministratorDashboard}
        exact={true}
      />,
      <Route
        key="customersShow"
        path={ROUTES.customersShow}
        component={CustomerPage}
        exact={true}
      />,
      <Route
        key="productsIndex"
        path={ROUTES.productsIndex}
        component={ProductSection}
        exact={true}
      />,

      <Redirect key="root" path={ROUTES.home} to={ROUTES.dashboard} exact={true} />,
    ];
  }

  public render() {
    return (
      <Switch location={this.props.location}>
        {this.renderIdentityRoutes()}
        {this.renderCommonRoutes()}
      </Switch>
    );
  }
}
