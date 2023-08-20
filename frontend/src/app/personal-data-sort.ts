import { PersonalData } from "./personal-data";

export type PersonalDataSortOrder = "ascending" | "descending";

export interface PersonalDataSort {
    key: keyof PersonalData;
    order: PersonalDataSortOrder;
}

export function isPersonalDataSortOrder(order: string): order is PersonalDataSortOrder {
    return order === "ascending" || order === "descending";
}