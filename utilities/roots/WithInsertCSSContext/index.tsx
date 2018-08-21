import * as PropTypes from "prop-types";
import * as React from "react";

interface Props {
  insertCss: any;
  children?: React.ReactNode;
}

export class WithInsertCSSContext extends React.Component<Props, {}> {
  public static childContextTypes = {
    insertCss: PropTypes.func,
  };

  public getChildContext() {
    return {insertCss: this.props.insertCss};
  }

  public render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}
