import {configure as MobXConfigure} from "mobx";
import {Provider as MobXProvider} from "mobx-react";
import * as React from "react";
import {StripeProvider} from "react-stripe-elements";
import "whatwg-fetch";

import {
  ConditionStore,
  CustomerMessageStore,
  CustomerStore,
  FormulationStore,
  IdentityStore,
  IngredientStore,
  PharmacistStore,
  PhysicianStore,
  SubscriptionStore,
} from "stores";

import {
  MyCustomerStore,
  MyMedicalProfileAuditStore,
  MyMessageStore,
  MyPhotoStore,
  MyStoryStore,
} from "stores/customers";

// Set MobX's strict mode on to ensure actions are labelled as such:
MobXConfigure({enforceActions: true});

// Initialize the stores in order:
const identityStore = new IdentityStore();
const physicianStore = new PhysicianStore();
const pharmacistStore = new PharmacistStore();
const customerStore = new CustomerStore({identityStore});
const subscriptionStore = new SubscriptionStore();
const ingredientStore = new IngredientStore();
const conditionStore = new ConditionStore();
const formulationStore = new FormulationStore();
const customerMessageStore = new CustomerMessageStore();

const myCustomerStore = new MyCustomerStore(identityStore);
const myMedicalProfileAuditStore = new MyMedicalProfileAuditStore();
const myMessageStore = new MyMessageStore();
const myPhotoStore = new MyPhotoStore(myCustomerStore);
const myStoryStore = new MyStoryStore({
  myCustomerStore,
  myMedicalProfileAuditStore,
  myMessageStore,
  myPhotoStore,
});

const stores = {
  identityStore,
  customerStore,
  subscriptionStore,
  customerMessageStore,
  physicianStore,
  pharmacistStore,
  ingredientStore,
  conditionStore,
  formulationStore,
  myCustomerStore,
  myMedicalProfileAuditStore,
  myMessageStore,
  myPhotoStore,
  myStoryStore,
};
export {
  identityStore,
  customerStore,
  subscriptionStore,
  customerMessageStore,
  physicianStore,
  pharmacistStore,
  ingredientStore,
  conditionStore,
  formulationStore,
  myCustomerStore,
  myMedicalProfileAuditStore,
  myMessageStore,
  myPhotoStore,
  myStoryStore,
};

export class Provider extends React.Component<{}, {}> {
  public render() {
    return (
      <StripeProvider apiKey={process.env.STRIPE_PUBLISHABLE_KEY}>
        <MobXProvider {...stores}>{this.props.children}</MobXProvider>
      </StripeProvider>
    );
  }
}
