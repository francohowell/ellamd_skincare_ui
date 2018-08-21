import {Id} from "models";

export interface Annotation {
  id?: Id;
  positionX: number;
  positionY: number;
  note: string;
}
