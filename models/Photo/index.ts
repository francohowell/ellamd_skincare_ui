import {observable} from "mobx";
import * as moment from "moment";

import {Id} from "models";
import {PhotoCondition} from "./PhotoCondition";

export * from "./Annotation";
export * from "./PhotoCondition";

export class Photo {
  @observable public id: Id;
  @observable public visitId: Id;
  @observable public thumbnailUrl: string;
  @observable public smallUrl: string;
  @observable public mediumUrl: string;
  @observable public largeUrl: string;
  @observable public photoConditions: PhotoCondition[];
  @observable public createdAt: moment.Moment;

  constructor(params: {[field in keyof Photo]: Photo[field]}) {
    Object.assign(this, params);

    if (!!params.createdAt) {
      this.createdAt = moment(params.createdAt);
    }
  }
}
