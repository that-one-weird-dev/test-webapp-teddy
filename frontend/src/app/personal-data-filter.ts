import { PersonalData } from "./personal-data";

export interface PersonalDataFilter {
    type: keyof PersonalData;
    value: string;
}
