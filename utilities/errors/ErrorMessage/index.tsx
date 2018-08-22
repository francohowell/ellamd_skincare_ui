import withStyles from "isomorphic-style-loader/lib/withStyles";
import * as React from "react";
import Helmet from "react-helmet";
import {Link} from "react-router-dom";

import {ROUTES} from "utilities";

import * as styles from "./index.css";

interface Props {
  pageTitle: string;
  status: string | number;
  heading: string;
  description: string;
}

@withStyles(styles)
export class ErrorMessage extends React.Component<Props, {}> {
  public render() {
    return (
      <div>
        <Helmet>
          <title>
            {this.props.pageTitle}
          </title>
        </Helmet>

        <div className={["pt-card", "pt-elevation-1", styles.errorBox].join(" ")}>
          <span className={styles.status}>
            {this.props.status}
          </span>
          <h1 className={styles.heading}>
            {this.props.heading}
          </h1>
          <p>
            {this.props.description}
          </p>

          <Link
            to={ROUTES.home}
            className={["pt-button", "pt-large", "pt-intent-primary", styles.callToAction].join(
              " "
            )}
          >
            Go to EllaMD
          </Link>
        </div>
      </div>
    );
  }
}
