import * as React from "react";
import {CSSTransitionGroup} from "react-transition-group";

import * as styles from "./index.css";

interface Props {
  className?: string;
  component?: string;
}
interface State {}

export class FadeTransitionGroup extends React.Component<Props, State> {
  public render() {
    return (
      <CSSTransitionGroup
        className={this.props.className}
        component={this.props.component}
        transitionName={{
          appear: styles.enter,
          appearActive: styles.enterActive,
          enter: styles.enter,
          enterActive: styles.enterActive,
          leave: styles.leave,
          leaveActive: styles.leaveActive,
        }}
        transitionAppear={true}
        transitionAppearTimeout={500}
        transitionEnterTimeout={500}
        transitionLeaveTimeout={500}
      >
        {this.props.children}
      </CSSTransitionGroup>
    );
  }
}
