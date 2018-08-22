import * as React from "react";
import {CardElement} from "react-stripe-elements";

import * as styles from "./index.css";

export class CardField extends React.Component {
  public render() {
    return (
      <div className={styles.fields}>
        <CardElement
          style={{
            base: {fontFamily: "lasiver", lineHeight: "24px", "::placeholder": {color: "#A7B6C2"}},
          }}
        />
      </div>
    );
  }
}
