import {Button, Dialog} from "@blueprintjs/core";
import * as React from "react";

import * as styles from "./index.css";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}
interface State {}

export class WelcomeDialog extends React.Component<Props, State> {
  public render() {
    return (
      <Dialog isOpen={this.props.isOpen} onClose={this.props.onClose}>
        <div className={["pt-dialog-body", styles.welcomeDialog].join(" ")}>
          <h2>
            Welcome to{" "}
            <span className={styles.logo}>
              <span>Ella</span>MD
            </span>
          </h2>
          <p className={styles.tagline}>Never worry about your skin again.</p>

          <div className={styles.columns}>
            <div>
              <img
                src={require("assets/images/welcomeSteps/welcomeStep1.svg")}
                className={styles.image}
              />
              <div className={styles.step}>
                <span className={styles.number}>1.</span>
                <p>Fill out our short, 2-minute online survey about your skin.</p>
              </div>
            </div>

            <div>
              <img
                src={require("assets/images/welcomeSteps/welcomeStep2.svg")}
                className={styles.image}
              />
              <div className={styles.step}>
                <span className={styles.number}>2.</span>
                <p>Get a treatment plan from an EllaMD dermatologist.</p>
              </div>
            </div>

            <div>
              <img
                src={require("assets/images/welcomeSteps/welcomeStep3.svg")}
                className={styles.image}
              />
              <div className={styles.step}>
                <span className={styles.number}>3.</span>
                <p>Use EllaMD’s custom medical-grade night cream.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-dialog-footer">
          <div className="pt-dialog-footer-actions">
            <Button onClick={this.props.onClose} className="pt-large pt-intent-primary">
              Got it — let’s go!
            </Button>
          </div>
        </div>
      </Dialog>
    );
  }
}
