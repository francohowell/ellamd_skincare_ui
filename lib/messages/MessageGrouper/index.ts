import {Message, MessageGroup} from "models";

export class MessageGrouper {
  private messages: Message[];

  constructor(messages: Message[]) {
    this.messages = messages;
  }

  public toMessageGroups(): MessageGroup[] {
    const groups: MessageGroup[] = [];

    if (this.messages.length === 0) {
      return groups;
    }

    let currentGroup = new MessageGroup(this.messages[0]);

    for (let i = 1; i < this.messages.length; i++) {
      const message = this.messages[i];
      const isSuccess = currentGroup.addMessage(message);

      if (!isSuccess) {
        groups.push(currentGroup);
        currentGroup = new MessageGroup(message);
      }
    }

    groups.push(currentGroup);

    return groups;
  }
}
