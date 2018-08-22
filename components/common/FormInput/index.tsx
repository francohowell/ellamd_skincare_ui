import * as classnames from "classnames";
import * as React from "react";

import * as styles from "./index.css";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export class FormInput extends React.Component<Props> {
  public render() {
    const {className, error, ...props} = this.props;
    return (
      <label className={classnames(styles.layout, className)}>
        <input className={classnames(styles.input, {[styles.hasError]: error})} {...props} />
        {error ? <span className={styles.errorMessage}>{error}</span> : undefined}
      </label>
    );
  }
}
