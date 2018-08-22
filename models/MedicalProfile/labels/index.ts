import {MedicalProfile} from "models";

// TODO: find a better place for this stuff

export const DEFAULT_DETAILS_LABEL = "Details...?";

export const FREQUENCY_LABELS: {[key in string]: string} = {
  daily: "Daily",
  few_times_week: "Few times a week",
  once_week: "Once a week",
  rarely: "Rarely",
  never: "Never",
};

export const SKIN_TYPE_LABELS: {[key in string]: string} = {
  very_light: "very light",
  light: "light",
  light_to_medium: "light to medium",
  medium: "medium",
  medium_to_dark: "medium to dark",
  dark: "dark",
};

export const MEDICAL_PROFILE_FIELD_LABELS: {[field in keyof MedicalProfile]?: string} = {
  sex: "Sex",
  dateOfBirth: "Date of birth",
  isSmoker: "Are you a smoker?",
  isPregnant: "Are you pregnant?",
  isBreastFeeding: "Are you breast feeding?",
  isOnBirthControl: "Are you on birth control?",
  knownAllergies: "Do you have any known allergies?",
  currentPrescriptionTopicalMedications:
    "Are you currently using any prescription topical medication?",
  currentPrescriptionOralMedications: "Are you currently taking any oral prescription medication?",
  currentNonprescriptionTopicalMedications:
    "Are you currently using any non-prescription topical products?",
  pastPrescriptionOralMedications:
    "Have you taken any oral prescription medication in the past 3 years?",
  pastPrescriptionTopicalMedications:
    "Have you used prescription topical medication in the past 3 years?",
  pastNonprescriptionTopicalMedications:
    "Have you used non-prescription topical products in the past 3 years?",
  usingPeels: "Are you currently using any peels?",
  usingRetinol: "Are you currently using retinol/retin-a?",
  hasBeenOnAccutane: "Have you ever been on Accutane?",
  hasHormonalIssues: "Have you noticed any hormonal component to your skin concerns?",
  otherConcerns: "Do you have other medical concerns?",
  preferredFragrance: "Preferred fragrance",
  skinType: "Type of skin",
  skinConcerns: "Skin concerns",
  sunscreenFrequency: "How often do you use sunscreen?",
  // sunscreen_brand: ???
  userSkinExtraDetails:
    "Is there anything else you want to tell us about your skin goals or otherwise?",
};

export const MEDICAL_PROFILE_DETAILS_LABELS: {[field in keyof MedicalProfile]?: string} = {
  knownAllergies: "Details...? [required]",
  currentPrescriptionOralMedications: "What kind, and frequency? [required]",
  pastPrescriptionOralMedications: "Additional details? Why did you stop taking the medication?",
  currentPrescriptionTopicalMedications: "What kind, and frequency? [required]",
  pastPrescriptionTopicalMedications: "Additional details? Why did you stop taking the medication?",
  currentNonprescriptionTopicalMedications: "What kind, and frequency? [required]",
  pastNonprescriptionTopicalMedications:
    "Additional details? Why did you stop taking the medication?",
  sunscreenBrand: "Which brand?",
  usingPeels: "How often? And what brand?",
  usingRetinol: "How often? And what brand?",
};
