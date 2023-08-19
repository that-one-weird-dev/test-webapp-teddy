import { PersonalData } from "./personal-data";

export interface PersonalDataFilter extends PersonalDataPropertyFilter {
}

export interface PersonalDataPropertyFilter {
    type: keyof PersonalData;
    value: string;
}
