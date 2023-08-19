import { PersonalData } from "./personal-data";

export interface PersonalDataSort {
    key: keyof PersonalData;
    order: "ascending" | "descending";
}
