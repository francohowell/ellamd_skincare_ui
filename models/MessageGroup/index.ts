import {action, computed, observable} from "mobx";
import * as moment from "moment";

import {Message} from "models";

const HOURS_INTERVAL = 24;

// TODO: #at should return #createdAt of the last message instead of referentialMessage
//       if messages are sorted in ASC order. Fortunately, it doesn't happen now
export class MessageGroup {
  private referentialMessage: Message;

  @observable public messages: Message[];

  constructor(message: Message) {
    this.referentialMessage = message;
    this.messages = [message];
  }

  @computed
  get fromCustomer(): boolean {
    return this.referentialMessage.fromCustomer;
  }

  @computed
  get at(): moment.Moment {
    return this.referentialMessage.createdAt;
  }

  @action
  public addMessage(message: Message): boolean {
    if (!this.canConsumeMessage(message)) {
      return false;
    }

    if (this.timeSinceReferentialMessage(message) > 0) {
      this.messages.push(message);
    } else {
      this.messages.unshift(message);
    }

    return true;
  }

  private canConsumeMessage(message: Message): boolean {
    return this.isBySameUser(message) && this.isInAcceptableInterval(message);
  }

  private isBySameUser(message: Message): boolean {
    return this.referentialMessage.fromCustomer === message.fromCustomer;
  }

  private isInAcceptableInterval(message: Message): boolean {
    return this.hoursSinceReferentialMessage(message) < HOURS_INTERVAL;
  }

  private hoursSinceReferentialMessage(message: Message): number {
    const timeBetweenMessages = Math.abs(this.timeSinceReferentialMessage(message));

    return moment.duration(timeBetweenMessages).asHours();
  }

  private timeSinceReferentialMessage(message: Message): number {
    return message.createdAt.diff(this.referentialMessage.createdAt);
  }
}
