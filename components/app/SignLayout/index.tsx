import {Spinner} from "@blueprintjs/core";
import * as classnames from "classnames";
import * as React from "react";

import {TestimonialsSlider} from "components/app/TestimonialsSlider";
import {HeaderType, UnauthorizedHeader} from "components/app/UnauthorizedHeader";
import {FadeTransitionGroup} from "components/common";

import * as styles from "./index.css";

interface Props {
  isLoading: boolean;
  errors?: string[];
  headerType: HeaderType;
  children?: React.ReactNode;
}

/**
 * The Sign basic layout.
 */
export class SignLayout extends React.Component<Props> {
  private renderSlider() {
    return <TestimonialsSlider />;
  }

  private renderLoadingOverlay() {
    if (!this.props.isLoading) {
      return;
    }

    return (
      <div className={styles.overlay}>
        <div className={styles.spinner}>
          <Spinner />
        </div>
      </div>
    );
  }

  private renderErrors() {
    const {errors} = this.props;
    if (!errors || errors.length === 0) {
      return;
    }

    return (
      <div className={styles.errorWrapper}>
        {errors.map(message => (
          <div className="pt-callout pt-intent-danger pt-icon-cross">{message}</div>
        ))}
      </div>
    );
  }

  public render() {
    const {children, headerType} = this.props;
    return (
      <section className={classnames(styles.layout)}>
        <div className={styles.header}>
          <UnauthorizedHeader type={headerType} />
        </div>
        <div className={styles.content}>
          <div className={styles.contentForm}>{children}</div>
          <div className={styles.contentSlider}>{this.renderSlider()}</div>
        </div>
        <ul className={styles.footer}>
          <li>Fast delivery</li>
          <li>Free shipping</li>
        </ul>

        {/* TODO: Needs to rework */}
        <FadeTransitionGroup>{this.renderErrors()}</FadeTransitionGroup>
        <FadeTransitionGroup>{this.renderLoadingOverlay()}</FadeTransitionGroup>
      </section>
    );
  }
}
