import {action, observable} from "mobx";

import {Fragrance} from "models";

export type MedicalProfileQuestion = false | string;

export type Sex = "male" | "female";

export enum FrequencyOptions {
  Daily = "daily",
  FewTimesPerWeek = "few_times_week",
  OnceWeek = "once_week",
  Rarely = "rarely",
  Never = "never",
}

export enum SkinType {
  VeryLight = "very_light",
  Light = "light",
  LightToMedium = "light_to_medium",
  Medium = "medium",
  MediumToDark = "medium_to_dark",
  Dark = "dark",
}

export class MedicalProfile {
  @observable public sex?: Sex;
  @observable public dateOfBirth?: string;

  @observable public isSmoker: MedicalProfileQuestion = false;
  @observable public isPregnant: MedicalProfileQuestion = false;
  @observable public isBreastFeeding: MedicalProfileQuestion = false;
  @observable public isOnBirthControl: MedicalProfileQuestion = false;
  @observable public knownAllergies: MedicalProfileQuestion = false;
  @observable public currentPrescriptionTopicalMedications: MedicalProfileQuestion = false;
  @observable public currentPrescriptionOralMedications: MedicalProfileQuestion = false;
  @observable public currentNonprescriptionTopicalMedications: MedicalProfileQuestion = false;
  @observable public pastNonprescriptionTopicalMedications: MedicalProfileQuestion = false;
  @observable public pastPrescriptionTopicalMedications: MedicalProfileQuestion = false;
  @observable public pastPrescriptionOralMedications: MedicalProfileQuestion = false;
  @observable public usingPeels: MedicalProfileQuestion = false;
  @observable public usingRetinol: MedicalProfileQuestion = false;
  @observable public hasBeenOnAccutane: MedicalProfileQuestion = false;
  @observable public hasHormonalIssues: MedicalProfileQuestion = false;
  @observable public otherConcerns: MedicalProfileQuestion = false;
  @observable public preferredFragrance?: Fragrance;
  @observable public skinType?: SkinType;
  @observable public skinConcerns?: string[];
  @observable public sunscreenFrequency: FrequencyOptions;
  @observable public sunscreenBrand?: string;
  @observable public userSkinExtraDetails?: string;

  constructor(fields: {[KeyT in keyof MedicalProfile]: MedicalProfile[KeyT]}) {
    Object.assign(this, fields);
  }

  @action
  public setField(field: keyof MedicalProfile, value: any) {
    this[field] = value;
  }
}
