import {Button, InputGroup, Intent, Radio} from "@blueprintjs/core";
import {observer} from "mobx-react";
import * as React from "react";
import {Collapse} from "react-collapse";

import {Customer} from "models";
import {Method, request, Status, Toaster} from "utilities";

import * as styles from "./index.css";

type Time = "now" | "8am" | "9pm";

interface Props {
  customer: Partial<Customer>;
}

interface State {
  phone: string;
  time: Time;
  isLoading: boolean;
  wasSubmitted: boolean;
}

@observer
export class SetPhoneField extends React.Component<Props, State> {
  public state: State = {
    phone: this.props.customer.phone || "",
    time: "now",
    isLoading: false,
    wasSubmitted: false,
  };

  private handlePhoneChange = (event: React.FormEvent<HTMLInputElement>) => {
    this.setState({phone: (event.target as any).value});
  };

  private handleTimeChange = (time: Time) => {
    this.setState({time});
  };

  private handleSubmit = async () => {
    this.setState({isLoading: true});

    const response = await request(
      `customers/${this.props.customer.id}/update-phone`,
      Method.POST,
      {phone: this.state.phone, time: this.state.time}
    );

    this.setState({isLoading: false});

    if (response.status === Status.Success) {
      const {customer} = response.data! as {customer: Customer};
      this.setState({phone: customer.phone || "", wasSubmitted: true});

      Toaster.show({
        message: "All right, we’ll text you!",
        intent: Intent.SUCCESS,
        iconName: "tick",
      });
    } else if (response.status === Status.Error) {
      Toaster.show({
        message: response.error,
        intent: Intent.WARNING,
        iconName: "warning-sign",
      });
    }
  };

  public render() {
    let submitButton;

    if (!this.state.wasSubmitted) {
      submitButton = (
        <Button
          className="pt-minimal pt-intent-primary"
          loading={this.state.isLoading}
          onClick={this.handleSubmit}
        >
          Submit
        </Button>
      );
    } else {
      submitButton = (
        <Button className="pt-minimal pt-intent-success" iconName="tick" disabled={true} />
      );
    }

    const labelNow = (
      <div className={styles.option}>
        <span>Text me now</span>
      </div>
    );
    const label8am = (
      <div className={styles.option}>
        <span>Text me at 8am</span>, after my morning shower!
      </div>
    );
    const label9pm = (
      <div className={styles.option}>
        <span>Text me at 9pm</span>, after I wash my face and get ready for bed.
      </div>
    );

    return (
      <div>
        <InputGroup
          type="text"
          className="pt-large"
          leftIconName="mobile-phone"
          onChange={this.handlePhoneChange}
          value={this.state.phone}
          rightElement={submitButton}
        />

        <Collapse isOpened={this.state.phone !== "" && !this.state.wasSubmitted}>
          <p className={styles.description}>
            Not in a good spot for a photo? No problem! We'll text you at a more convenient time,
            and just respond with your photos!
          </p>

          <div className={styles.timeOptions}>
            <Radio
              onChange={_event => this.handleTimeChange("now")}
              checked={this.state.time === "now"}
              labelElement={labelNow}
            />
            <Radio
              onChange={_event => this.handleTimeChange("8am")}
              checked={this.state.time === "8am"}
              labelElement={label8am}
            />
            <Radio
              onChange={_event => this.handleTimeChange("9pm")}
              checked={this.state.time === "9pm"}
              labelElement={label9pm}
            />
          </div>
        </Collapse>
      </div>
    );
  }
}
