import * as classnames from "classnames";
import * as React from "react";
import {NavLink} from "react-router-dom";
import {ROUTES} from "utilities";

import * as buttonStyles from "styles/buttons.css";
import * as styles from "./index.css";

export enum HeaderType {
  SignIn,
  SignUp,
}

interface Props {
  type: HeaderType;
}

export class UnauthorizedHeader extends React.Component<Props> {
  public render() {
    return (
      <header className={styles.layout}>
        <div className={styles.left}>
          <a className={styles.back} href="https://ellamd.com">
            Back to home
          </a>
        </div>
        <a className={styles.logo} href="https://ellamd.com">
          <img src={require("assets/images/logoBlue.svg")} />
        </a>
        {this.renderRightLayout()}
      </header>
    );
  }

  private renderRightLayout = () => {
    switch (this.props.type) {
      case HeaderType.SignIn:
        return (
          <div className={styles.right}>
            <span className={styles.hintMobile}>Have an account?</span>
            <span className={styles.hintDesktop}>Already have an account?</span>
            <NavLink
              className={classnames(buttonStyles.primary, buttonStyles.small, styles.action)}
              exact={true}
              to={ROUTES.signIn}
            >
              Log in
            </NavLink>
          </div>
        );
      case HeaderType.SignUp:
        return (
          <div className={styles.right}>
            <span className={styles.hint}>Don't have an account?</span>
            <NavLink
              className={classnames(buttonStyles.primary, buttonStyles.small, styles.action)}
              exact={true}
              to={ROUTES.signUp}
            >
              Sign up
            </NavLink>
          </div>
        );
    }
  };
}
