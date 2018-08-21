import {CustomerField} from "components/customers/fields";
import {Customer} from "models";
import {MemoryRouter} from "react-router";
import {create} from "react-test-renderer";

import * as React from "react";

test("renders correctly", () => {
  const customerData = {
    id: 287, firstName: "Dora", lastName: "Hare", email: "customer+3@ellamd.com",
    createdAt: "2017-09-27T21:49:27.921Z", updatedAt: "2017-11-06T21:49:28.688Z", lastOnboardingStep: 4,
    physician:
      {
        id: 2, firstName: "Jack", lastName: "Physician", email: "physician@ellamd.com"
      },
    subscription:
      {
        id: 123,
        status: "inexistent",
        stripe_customer_id: "cus_123",
        initial_treatment_plan_is_free: false
      },
    visits:
      [{id: 116, createdAt: "2017-11-01T21:49:28.666Z", photos: []}],
    photos: [],
    dateOfBirth: "1988-04-15",
    sex: "female",
    addressLine1: "397 Libby Street",
    addressLine2: "Apt 2",
    zipCode: "90210",
    state: "CA",
    city: "Beverly Hills",
    skinConcerns: ["acne", "sun spots"],
    skinType: 3} as any;

  const customer = new Customer(customerData);

  const component = create(
    <MemoryRouter>
      <CustomerField field="firstName" customer={customer} />
    </MemoryRouter>
  );

  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
