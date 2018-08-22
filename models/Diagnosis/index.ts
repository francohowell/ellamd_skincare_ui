import {Id, Physician} from "models";
import {DiagnosisCondition} from "./DiagnosisCondition";

export * from "./DiagnosisCondition";

export interface Diagnosis {
  id: Id;
  diagnosisConditions: DiagnosisCondition[];
  physician: Physician;
  note: string;
  createdAt: string;
}
