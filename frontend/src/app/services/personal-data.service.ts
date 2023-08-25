import { Injectable } from "@angular/core";
import { PersonalData } from "../interfaces/personal-data";
import { PersonalDataFilter } from "../interfaces/personal-data-filter";
import { PersonalDataSort } from "../interfaces/personal-data-sort";
import { PaginatedPersonalDataModel } from "../interfaces/models/paginated-personal-data-model";
import {
    ResponseModel,
    responseIsError,
    responseIsOk,
} from "../interfaces/models/response-model";
import { HttpClient } from "@angular/common/http";
import { Observable, catchError, map } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class PersonalDataService {
    baseUrl = "http://localhost:8080";
    personalDataUrl = `${this.baseUrl}/api/personal-data`;

    constructor(private httpClient: HttpClient) {}

    getPaginatedPersonalData(
        page: number,
        limit: number,
        filters: PersonalDataFilter[] = [],
        sort: PersonalDataSort = { key: "firstname", order: "ascending" }
    ): Observable<PaginatedPersonalDataModel> {
        const filterString = filters
            .map((filter) => {
                return `${filter.type}:${filter.value}`;
            })
            .join(",");

        const sortString = `${sort.key}:${
            sort.order == "ascending" ? "asc" : "desc"
        }`;

        return this.httpClient
            .get<ResponseModel<PaginatedPersonalDataModel>>(
                this.personalDataUrl,
                {
                    params: {
                        page: page - 1,
                        pageSize: limit,
                        filters: filterString,
                        sort: sortString,
                    },
                }
            )
            .pipe(
                map((response) => {
                    if (responseIsError(response)) {
                        throw new Error(response.error);
                    }

                    return response.data;
                })
            );
    }

    async getPersonalDataById(id: string): Promise<PersonalData> {
        const data = await fetch(`${this.personalDataUrl}/${id}`);

        const response = (await data.json()) as ResponseModel<PersonalData>;

        if (responseIsError(response)) {
            throw Promise.reject(response.error);
        }

        return response.data;
    }

    async createPersonalData(data: PersonalData): Promise<string> {
        data.id = this.generateRandomId();
        await fetch(`${this.personalDataUrl}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        return data.id;
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

    async findRowIndexOfId(id: string): Promise<number> {
        const response = await fetch(
            `${this.personalDataUrl}?_sort=firstname&_order=asc`
        );
        const personalData: PersonalData[] = (await response.json()) ?? [];

        return personalData.findIndex((data) => data.id === id);
    }

    private generateRandomId(): string {
        return Math.random().toString(36).slice(2);
    }
}
