import {Spinner as BlueprintSpinner} from "@blueprintjs/core";
import * as React from "react";

import * as styles from "./index.css";

type Position = "center" | "relative" | "overlay";

interface Props {
  className?: string;
  title?: string;
  description?: string;
  position?: Position;
}

// TODO: implement `overlay` position
export class Spinner extends React.Component<Props> {
  public static defaultProps: Partial<Props> = {
    className: "",
    title: "Loading...",
    description: "",
    position: "relative",
  };

  public render() {
    return (
      <div className={`pt-non-ideal-state ${styles.container} ${this.specificContainerStyle()}`}>
        <div className="pt-non-ideal-state-visual pt-non-ideal-state-icon">
          <BlueprintSpinner className={`pt-large ${styles.spinner} ${this.props.className}`} />
        </div>
        <h4 className="pt-non-ideal-state-title">{this.props.title}</h4>
        <div className="pt-non-ideal-state-description">{this.props.description}</div>
      </div>
    );
  }

  private specificContainerStyle() {
    return this.props.position === "center" ? styles.containerCentered : styles.containerRelative;
  }
}
