import {observer} from "mobx-react";
import * as React from "react";

import {Message, MessageGroup} from "models";

interface Props {
  messageGroup: MessageGroup;
}

@observer
export class MessageGroupStoryItem extends React.Component<Props> {
  public render() {
    const {messages} = this.props.messageGroup;

    return <div>{messages.map((message, index) => this.renderMessage(message, index))}</div>;
  }

  private renderMessage(message: Message, index: number) {
    return <div key={index}>{message.content}</div>;
  }
}
