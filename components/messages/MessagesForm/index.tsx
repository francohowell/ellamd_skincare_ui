import {action, observable} from "mobx";
import * as React from "react";

import {Button} from "@blueprintjs/core";
import {observer} from "mobx-react";

import * as styles from "./index.css";

interface Props {
  onMessageSubmit: (message: string) => void;
}

class Store {
  private props: Props;

  @observable public message: string;

  constructor(props: Props) {
    this.props = props;
    this.message = "";
  }

  @action
  public submitMessage(): void {
    this.props.onMessageSubmit(this.message);
    this.message = "";
  }

  @action
  public setMessage(message: string): void {
    this.message = message;
  }
}

@observer
export class MessagesForm extends React.Component<Props> {
  private store: Store;

  constructor(props: Props) {
    super(props);
    this.store = new Store(props);
  }

  public render() {
    return (
      <form
        className={styles.messageForm}
        onSubmit={event => {
          event.preventDefault();
          this.store.submitMessage();
        }}
      >
        <label className="pt-label">
          New Message
          <input
            className="pt-input pt-fill pt-large"
            type="message"
            onChange={event => this.store.setMessage(event.target.value)}
            value={this.store.message}
          />
        </label>

        <Button className={`pt-intent-primary pt-large ${styles.submit}`} type="submit">
          Send
        </Button>
      </form>
    );
  }
}
