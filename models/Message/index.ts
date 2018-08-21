import {computed, observable} from "mobx";
import * as moment from "moment";

import {Id} from "models";

export class Message {
  @observable public id: Id;
  @observable public physicianId: Id;
  @observable public customerId: Id;
  @observable public content: string;
  @observable public fromCustomer: boolean;
  @observable public createdAt: moment.Moment;

  constructor(params: {[field in keyof Message]: Message[field]}) {
    Object.assign(this, params);

    if (!!params.createdAt) {
      this.createdAt = moment(params.createdAt);
    }
  }

  @computed
  get at(): moment.Moment {
    return this.createdAt;
  }
}
