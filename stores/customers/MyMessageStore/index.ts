import {action, computed} from "mobx";
import {ILazyObservable, lazyObservable} from "mobx-utils";

import {Message} from "models";
import {Method, request, Status as RequestStatus} from "utilities";

type MessagesSinkT = (newValue: Message[]) => void;

export class MyMessageStore {
  private _messagesSink: MessagesSinkT;
  private _messages: ILazyObservable<Message[]>;

  constructor() {
    this._messages = lazyObservable(sink => {
      this._messagesSink = sink;
      this.fetchMessages();
    });
  }

  @computed
  get isLoading(): boolean {
    return this._messages.current() === undefined;
  }

  @computed
  get descendingMessages(): Message[] {
    return this.messages.slice().sort((messageA, messageB) => -messageA.at.diff(messageB.at));
  }

  @computed
  get messages(): Message[] {
    if (this.isLoading) {
      throw new Error("Attempt to dereference messages while MyMessageStore is loading");
    }

    return this._messages.current();
  }

  @action
  public async sendMessage(messageString: string) {
    const response = await request(`messages`, Method.POST, {
      message: messageString,
    });

    if (response.status === RequestStatus.Error) {
      throw new Error(`Error while sending message: ${response.error}`);
    }

    this.appendMessage(new Message(response.data.message));
  }

  @action
  private appendMessage(message: Message) {
    const messages = this.messages.slice();
    messages.push(message);

    this._messagesSink(messages);
  }

  private async fetchMessages(): Promise<void> {
    const response = await request("messages", Method.GET);

    if (response.status === RequestStatus.Error) {
      throw new Error(`Error while fetching messages: ${response.error}`);
    }

    const rawMessages = response.data.messages as Message[];
    const messages = rawMessages.map(messageParams => new Message(messageParams));

    this._messagesSink(messages);
  }
}
