import {Condition, Id} from "models";

export interface PhotoCondition {
  id: Id;
  canvasData?: string;
  condition: Condition;
  note: string;
}
