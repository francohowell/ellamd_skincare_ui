import * as classnames from "classnames";
import * as React from "react";

import * as styles from "./index.css";

interface Props {
  index: number;
  dots: number;
  onChangeIndex?: (index: number) => void;
  className?: string;
}

export class PageControl extends React.Component<Props> {
  public render() {
    const pages = new Array(this.props.dots).fill(0).map((_value, index) => index);

    return (
      <div className={classnames(this.props.className, styles.control)}>
        {this.props.dots > 8 ? this.renderCounter() : pages.map(this.renderPage)}
      </div>
    );
  }

  private renderPage = (index: number) => {
    if (this.props.dots <= 1) {
      return undefined;
    }

    const modifiers = {
      [styles.isSelected]: index === this.props.index,
    };

    return (
      <div
        key={index}
        className={classnames(styles.page, modifiers)}
        onClick={() => this.handleChangeIndex(index)}
      >
        <span />
      </div>
    );
  };

  private renderCounter = () => {
    return (
      <div className={classnames(styles.counter)}>
        <strong>{this.props.index + 1}</strong> / {this.props.dots}
      </div>
    );
  };

  private handleChangeIndex = (index: number) => {
    if (this.props.onChangeIndex) {
      this.props.onChangeIndex(index);
    }
  };
}
