import * as React from "react";

import * as styles from "./index.css";

export interface Props {
  className?: string;
  isChecked: boolean;
  isHovered?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  children?: React.ReactNode;
}

export class Checkbox extends React.Component<Props> {
  private handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (this.props.onChange) {
      this.props.onChange(event.target.checked);
    }
  };

  private renderLabel() {
    if (!this.props.label && !this.props.children) {
      return;
    }

    return <span className={styles.label}>{this.props.label || this.props.children}</span>;
  }

  public render() {
    const inputProps = this.props.onChange ? {onChange: this.handleChange} : {readOnly: true};

    return (
      <label
        className={[
          this.props.className,
          styles.wrapper,
          this.props.isChecked ? styles.isChecked : undefined,
          this.props.isHovered ? styles.isHovered : undefined,
        ].join(" ")}
      >
        <input
          type="checkbox"
          className={styles.input}
          {...inputProps}
          checked={this.props.isChecked}
        />

        <span className={styles.indicator}>
          <span className={styles.tick} />
        </span>

        {this.renderLabel()}
      </label>
    );
  }
}
