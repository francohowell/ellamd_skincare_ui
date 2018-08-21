import "utilities/polyfill";

import * as React from "react";
import * as ReactDOM from "react-dom";
import {Router} from "react-router-dom";

import {Entry} from "entries";
import {history, WithInsertCSSContext} from "utilities";

// Create the root component:
const voidCssInjector = (..._styles: any[]) => {
  // Purposefully blank: the CSS bundle is already injected by Webpack!
};

const root = (
  <WithInsertCSSContext insertCss={voidCssInjector}>
    <Router history={history}>
      <Entry />
    </Router>
  </WithInsertCSSContext>
);

// Mount the app:
ReactDOM.render(root, document.getElementById("root"));
