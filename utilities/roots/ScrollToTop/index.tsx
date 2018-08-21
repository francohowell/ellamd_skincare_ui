import * as React from "react";
import {withRouter} from "react-router-dom";

class ScrollToTop extends React.Component<any, {}> {
  public componentDidUpdate(previousProps: any) {
    if (this.props.location !== previousProps.location && typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  }

  public render() {
    // tslint:disable-next-line no-null-keyword
    return null;
  }
}

// We can't do this as a decorator because it confuses TypeScript:
const scrollToTopWithRouter = withRouter(ScrollToTop);
export {scrollToTopWithRouter as ScrollToTop};
