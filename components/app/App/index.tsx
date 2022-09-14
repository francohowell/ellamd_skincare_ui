import {inject, observer} from "mobx-react";
import * as React from "react";
import {Route} from "react-router-dom";

import {Header} from "components/app/Header";
import {Spinner} from "components/common";
import {IdentityStore} from "stores";
import {Router, ROUTES} from "utilities";

// We use some external CSS, namely the Blueprint.js styling and normalize.css. We also include here
// `styles/blueprint.css` which overrides some of the global styles from Blueprint.
import "@blueprintjs/core/dist/blueprint.css";
import "instantsearch.css/themes/algolia.css";
import "normalize.css/normalize.css";
import "styles/blueprint.css";

import * as styles from "./index.css";

interface Props {
  identityStore?: IdentityStore;
  onServer: boolean;
  path: string;
}

/**
 * The App component is the top-level component repsonsible for mounting the app's Router.
 */
@inject("identityStore")
@observer
export class App extends React.Component<Props> {
  public render() {
    if (this.props.identityStore!.isLoading || this.props.onServer) {
      return <Spinner position="center" />;
    }

    /* It's not necessary to break layout of whole app as of now. Once every screen reworked
       it should be easy to get rid of old layout */
    if ([ROUTES.signUp, ROUTES.signIn].indexOf(this.props.path) !== -1) {
      return this.renderEmptyLayout();
    }

    return (
      <div
        className={
          this.props.identityStore!.currentIdentity &&
          this.props.identityStore!.currentIdentity!.userType === "Customer"
            ? styles.customerWrapper
            : undefined
        }
      >
        <div
          className={[
            styles.app,
            this.props.identityStore!.currentIdentity &&
            this.props.identityStore!.currentIdentity!.userType === "Customer"
              ? styles.customer
              : undefined,
          ].join(" ")}
        >
          <Header />

          {/* We wrap `Router` in a pathless `Route` because MobX's injector wraps our `Router`
            component in a higher-order component which implements `shouldComponentUpdate` and
            overzealously stops the app from changing when the path changes and ReactRouter
            tries to re-render. We could also pass in a prop that changes with the URL, but
            this was simpler. */}
          <Route
            render={({location}) => (
              <div>
                <div className={styles.content}>
                  <div className={styles.innerContent} key={location.pathname}>
                    <Router location={location} onServer={this.props.onServer} />
                  </div>
                </div>
              </div>
            )}
          />
        </div>
      </div>
    );
  }

  private renderEmptyLayout = () => (
    <Route render={({location}) => <Router location={location} onServer={this.props.onServer} />} />
  );
}
