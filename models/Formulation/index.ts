import {CreamBase, Id} from "models";
import {FormulationIngredient} from "./FormulationIngredient";

export * from "./FormulationIngredient";

export interface Formulation {
  id: Id;
  number: number;
  mainTag: string;
  formulationIngredients: FormulationIngredient[];
  creamBase: CreamBase;
}
