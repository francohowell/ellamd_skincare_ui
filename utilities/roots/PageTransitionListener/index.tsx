import * as React from "react";
import {withRouter} from "react-router-dom";

import {Analytics} from "utilities";

class PageTransitionListener extends React.Component<any, {}> {
  public componentDidUpdate(previousProps: any) {
    if (this.props.location.pathname !== previousProps.location.pathname) {
      Analytics.page();
      Analytics.track(`Hit ${this.props.location.pathname}`);
    }
  }

  public render() {
    // tslint:disable-next-line no-null-keyword
    return null;
  }
}

// We can't do this as a decorator because it confuses TypeScript:
const pageTransitionListenerWithRouter = withRouter(PageTransitionListener);
export {pageTransitionListenerWithRouter as PageTransitionListener};
