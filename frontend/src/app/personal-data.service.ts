import { Injectable } from "@angular/core";
import { PersonalData } from "./personal-data";
import { PersonalDataFilter } from "./personal-data-filter";

export interface PaginatedPersonalData {
    personalData: PersonalData[];
    totalCount: number;
}

@Injectable({
    providedIn: "root",
})
export class PersonalDataService {
    baseUrl = "http://localhost:3000";
    personalDataUrl = `${this.baseUrl}/personal-data`;

    constructor() {}

    async getPaginatedPersonalData(
        page: number,
        limit: number,
        filters: PersonalDataFilter[] = []
    ): Promise<PaginatedPersonalData> {
        const filterString = filters.reduce((filterString, filter) => {
            return filterString + `&${filter.type}_like=${filter.value}`;
        }, "");

        const data = await fetch(
            `${this.personalDataUrl}?_page=${page}&_limit=${limit}${filterString}`
        );

        return {
            personalData: (await data.json()) ?? [],
            totalCount: parseInt(data.headers.get("x-total-count") ?? ""),
        };
    }

    async getPersonalDataById(id: string): Promise<PersonalData> {
        const data = await fetch(`${this.personalDataUrl}/${id}`);
        return (await data.json()) ?? {};
    }

    async createPersonalData(data: PersonalData) {
        await fetch(`${this.personalDataUrl}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
    }

    async editPersonalData(data: PersonalData) {
        await fetch(`${this.personalDataUrl}/${data.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
    }

    async deletePersonalData(id: string) {
        await fetch(`${this.personalDataUrl}/${id}`, {
            method: "DELETE",
        });
    }
}
