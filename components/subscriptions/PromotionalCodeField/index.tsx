import {Button, InputGroup} from "@blueprintjs/core";
import * as React from "react";

import * as styles from "./index.css";

interface Props {
  className?: string;
  onSubmit(promoCode: string): void;
}
interface State {
  promoCode: string;
}

export class PromotionalCodeField extends React.Component<Props, State> {
  public state: State = {
    promoCode: "",
  };

  private handlePromoCodeChange = (event: React.FormEvent<HTMLElement>) => {
    const value: string = (event.target as HTMLInputElement).value;
    this.setState({promoCode: value.toUpperCase().replace(/[^A-Z0-9]/g, "")});
  }

  private handleSubmitPromoCode = () => {
    this.props.onSubmit(this.state.promoCode);
  }

  private renderSubmitButton = () => (
    <Button className="pt-minimal pt-intent-primary" onClick={this.handleSubmitPromoCode}>
      Apply
    </Button>
  )

  public render() {
    return (
        <div className={this.props.className}>
          <h3 className={styles.label}>Promotional code</h3>
          <p>Have a promotional code from EllaMD? Enter and apply it here:</p>
          <InputGroup
            type="text"
            onChange={this.handlePromoCodeChange}
            value={this.state.promoCode}
            rightElement={this.renderSubmitButton()}
            className={["pt-large", styles.promoCodeForm].join(" ")}
          />
        </div>
    );
  }
}
