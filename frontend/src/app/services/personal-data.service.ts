import { Injectable } from "@angular/core";
import { PersonalData } from "../interfaces/personal-data";
import { PersonalDataFilter } from "../interfaces/personal-data-filter";
import { PersonalDataSort } from "../interfaces/personal-data-sort";
import { PaginatedPersonalDataModel } from "../interfaces/models/paginated-personal-data-model";
import {
    ResponseModel,
    responseIsError,
} from "../interfaces/models/response-model";
import { HttpClient } from "@angular/common/http";
import { Observable, catchError, map } from "rxjs";
import { PersonalDataCreateModel } from "../interfaces/models/personal-data-create-model";
import { PersonalDataPageOfModel } from "../interfaces/models/personal-data-page-of-model";
import { environment } from "src/environments/environment";

function mapResponseError<T>() {
    return map((response: ResponseModel<T>) => {
        if (responseIsError(response)) {
            throw new Error(response.error);
        }

        return response.data;
    });
}

@Injectable({
    providedIn: "root",
})
export class PersonalDataService {
    personalDataUrl = `${environment.apiUrl}/api/personal-data`;

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
            .pipe(mapResponseError());
    }

    getPersonalDataById(id: string): Observable<PersonalData> {
        return this.httpClient
            .get<ResponseModel<PersonalData>>(`${this.personalDataUrl}/${id}`)
            .pipe(mapResponseError());
    }

    createPersonalData(
        data: PersonalData
    ): Observable<PersonalDataCreateModel> {
        return this.httpClient
            .post<ResponseModel<PersonalDataCreateModel>>(
                this.personalDataUrl,
                data
            )
            .pipe(mapResponseError());
    }

    editPersonalData(data: PersonalData): Observable<{}> {
        return this.httpClient
            .put<ResponseModel<{}>>(`${this.personalDataUrl}/${data.id}`, data)
            .pipe(mapResponseError());
    }

    deletePersonalData(id: string): Observable<{}> {
        return this.httpClient
            .delete<ResponseModel<{}>>(`${this.personalDataUrl}/${id}`)
            .pipe(mapResponseError());
    }

    findPageOfId(id: string): Observable<PersonalDataPageOfModel> {
        return this.httpClient
            .get<ResponseModel<PersonalDataPageOfModel>>(
                `${this.personalDataUrl}/page-of/${id}`
            )
            .pipe(mapResponseError());
    }
}
