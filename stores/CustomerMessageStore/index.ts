import {action, observable} from "mobx";

import {Message} from "models";
import {Method, request, Status} from "utilities";

export class CustomerMessageStore {
  @observable public messages?: Message[];
  @observable public isLoading: boolean = false;

  @action
  private setMessages(messages: Message[]) {
    this.messages = messages;
  }

  @action
  private appendMessage(message: Message) {
    if (this.messages) {
      this.messages.push(message);
    }
  }

  @action
  private setIsLoading(isLoading: boolean) {
    this.isLoading = isLoading;
  }

  public sendMessage = async (customerId: number, message: string) => {
    const response = await request(`customers/${customerId}/messages`, Method.POST, {
      message,
    });

    if (response.status === Status.Success) {
      this.appendMessage(response.data.message as Message);
    }
  };

  public fetchMessages = async (customerId: number) => {
    this.setIsLoading(true);

    const response = await request(`customers/${customerId}/messages`, Method.GET);

    switch (response.status) {
      case Status.Success:
        this.setMessages(response.data.messages as Message[]);
        this.setIsLoading(false);
        break;

      case Status.Error:
        throw new Error(`Error while fetching messages: ${response.error}`);
    }
  };
}
