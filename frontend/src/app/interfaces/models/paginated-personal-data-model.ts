import { PersonalData } from "../personal-data";

export interface PaginatedPersonalDataModel {
    personalData: PersonalData[];
    totalCount: number;
}
