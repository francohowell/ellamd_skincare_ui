import {Intent} from "@blueprintjs/core";
import * as React from "react";
import Helmet from "react-helmet";
import {Route} from "react-router-dom";

import {App} from "components/app";
import {PageTransitionListener, Provider, ScrollToTop, Toaster} from "utilities";

const SHOW_GLOBAL_ERROR = false;

interface Props {
  children?: React.ReactNode;
  onServer?: boolean;
}

if (typeof window !== "undefined") {
  if (SHOW_GLOBAL_ERROR) {
    let shownGlobalError = false;

    window.onerror = (_errorMessage, _url, _lineNumber) => {
      if (!shownGlobalError) {
        Toaster.show({
          action: {onClick: () => window.location.reload(true), text: "refresh"},
          message:
            "Uh oh — an error has occurred. The EllaMD team has been notified and will investigate the cause. You might want to refresh the page and try again.",
          timeout: 0,
          intent: Intent.DANGER,
          iconName: "error",
        });

        shownGlobalError = true;
      }

      return false;
    };
  }

  (window as any).Raven.config(process.env.SENTRY_CONFIG_URL).install();
}

export class Entry extends React.Component<Props> {
  public static defaultProps: Partial<Props> = {
    onServer: false,
  };

  public render() {
    return (
      <div>
        <Helmet titleTemplate="EllaMD • %s">
          <title>personalized skincare service</title>
          <meta
            name="description"
            content="EllaMD is your personalized skincare service. After sending us your skincare goals and pictures, we provide you with a simplified, personalized regimen, including a personalized pharmaceutical grade serum formulated uniquely for you. We're committed to ongoing improvement for our customers and great outcomes; we provide bi-monthly reformulations based on machine learning and checkins from our world class dermatologists. Never worry about your skin again, EllaMD has you covered."
          />
        </Helmet>

        <ScrollToTop />
        <PageTransitionListener />

        <Provider>
          <Route
            render={({location}) => (
              <App path={location.pathname} onServer={this.props.onServer!} />
            )}
          />
        </Provider>
      </div>
    );
  }
}
