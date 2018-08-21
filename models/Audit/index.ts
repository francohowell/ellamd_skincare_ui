import {observable} from "mobx";
import * as moment from "moment";

import {Id, UserType} from "models";

export type AuditAction = "create" | "update" | "destroy";

export type AuditedChanges<T> = {[K in keyof T]?: [T[K], T[K]]};

export class Audit<T> {
  @observable public id: Id;
  @observable public userId: Id;
  @observable public userType: UserType;

  @observable public action: AuditAction;
  @observable public auditedChanges: AuditedChanges<T>;

  @observable public version: number;

  @observable public createdAt: moment.Moment;

  constructor(fields: {[field in keyof Audit<T>]: Audit<T>[field]}) {
    Object.assign(this, fields);

    if (!!fields.createdAt) {
      this.createdAt = moment(fields.createdAt);
    }
  }
}
