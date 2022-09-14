import * as React from "react";
import {RouteComponentProps} from "react-router-dom";
import {Elements as StripeElements} from "react-stripe-elements";

import {OnboardingForm} from "./OnboardingForm";

export * from "./OnboardingForm";

interface Props extends RouteComponentProps<any> {}

/**
 * The OnboardingPage is the main onboarding page.
 */
export class OnboardingPage extends React.Component<Props> {
  public render() {
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
        <OnboardingForm />
      </StripeElements>
    );
  }
}
