import {inject, observer} from "mobx-react";
import * as moment from "moment";
import * as React from "react";

import {Customer, Message, Physician} from "models";

import * as styles from "./index.css";

interface Props {
  customer: Customer;
  messages: Message[];
  physician: Physician;
}

@inject("physicianStore")
@observer
export class MessagesList extends React.Component<Props> {
  private bottomAnchor: HTMLDivElement;

  public componentDidMount() {
    this.scrollToBottom();
  }

  public componentDidUpdate() {
    this.scrollToBottom();
  }

  public render() {
    return this.renderMessages();
  }

  private renderMessages() {
    const {customer, messages, physician} = this.props;

    const customerName = `${customer.firstName} ${customer.lastName}`;
    const physicianName = `${physician.firstName} ${physician.lastName}`;

    return (
      <div className={styles.messages}>
        {messages.map((message: Message) => (
          <div key={message.id} className={styles.message}>
            <div className={styles.content}>{message.content}</div>
            <div className={styles.data}>
              <div className={styles.by}>
                By: {message.fromCustomer ? customerName : physicianName}
              </div>
              <div className={styles.date}>
                Sent at: {moment(message.createdAt).format("M/D/YY HH:MM")}
              </div>
            </div>
          </div>
        ))}

        <div ref={el => (this.bottomAnchor = el!)} />
      </div>
    );
  }

  private scrollToBottom() {
    this.bottomAnchor.scrollIntoView();
  }
}
