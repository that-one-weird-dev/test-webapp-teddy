import { Component, OnInit, inject } from "@angular/core";
import { PersonalData, isPersonalDataKey } from "../personal-data";
import { PersonalDataService } from "../personal-data.service";
import { ActivatedRoute, Router } from "@angular/router";
import { PageChangedEvent } from "ngx-bootstrap/pagination";
import Swal from "sweetalert2";
import { PersonalDataFilter } from "../personal-data-filter";
import {
    PersonalDataSort,
    isPersonalDataSortOrder,
} from "../personal-data-sort";
import { ViewportScroller } from "@angular/common";

export const PersonalDataListPageSize: number = 10;

@Component({
    selector: "personal-data",
    templateUrl: "./personal-data.component.html",
    styleUrls: ["./personal-data.component.scss"],
})
export class PersonalDataComponent implements OnInit {
    mediaQuery!: MediaQueryList;
    /** This is the actual current page */
    currentPage: number = 1;
    /** and this is the page that the pagination component displays.
     *  This is used because otherwise the pagination component would fire a pageChanged event
     *  every time the currentPage is changed meaning double the rest api calls, which is no good :(
     */
    currentPaginationPage: number = 1;
    pageSize: number = PersonalDataListPageSize;
    paginationMaxSize: "small" | "large" = "large";
    totalItems: number = 100;
    loading: boolean = true;
    highlightId?: string;

    filters: PersonalDataFilter[] = [];
    sort: PersonalDataSort = { key: "firstname", order: "ascending" };

    personalData!: PersonalData[];
    personalDataService: PersonalDataService = inject(PersonalDataService);

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private viewportScroller: ViewportScroller
    ) {}

    edit(data: PersonalData) {
        this.router.navigate(["/edit", data.id]);
    }

    async delete(data: PersonalData) {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: `You will delete all the data regarding ${data.firstname} ${data.surname}, this is not reversible!`,
            showCancelButton: true,
            focusCancel: true,
        });

        if (!result.isConfirmed) return;

        this.loading = true;
        await this.personalDataService.deletePersonalData(data.id);
        await this.updateData();
    }

    addFilters(filters: PersonalDataFilter[]) {
        this.reroute(
            this.currentPage,
            [...this.filters, ...filters],
            this.sort
        );
    }

    removeFilter(filter: PersonalDataFilter) {
        this.reroute(
            this.currentPage,
            this.filters.filter((f) => f != filter),
            this.sort
        );
    }

    changeSort(sort: PersonalDataSort) {
        this.reroute(this.currentPage, this.filters, sort);
    }

    changePage(event: PageChangedEvent) {
        if (event.page === this.currentPage) return;

        this.reroute(event.page, this.filters, this.sort);
    }

    reroute(
        page: number,
        filters: PersonalDataFilter[],
        sort: PersonalDataSort
    ) {
        const filtersString = filters.reduce((str, filter) => {
            return `${str}${filter.type}:${filter.value},`;
        }, "");
        const sortString = this.isDefaultSort(sort)
            ? ""
            : `${sort.key}:${sort.order}`;

        this.router.navigate(["/"], {
            queryParams: {
                page: page.toString(),
                filters: filtersString || undefined,
                sort: sortString || undefined,
            },
        });
    }

    async updateData() {
        const data = await this.personalDataService.getPaginatedPersonalData(
            this.currentPage,
            this.pageSize,
            this.filters,
            this.sort
        );

        this.personalData = data.personalData;
        this.totalItems = data.totalCount;
        this.loading = false;
        this.currentPaginationPage = this.currentPage;

        // I need to use setTimout because this needs to run after the component view is loaded
        setTimeout(() => {
            this.viewportScroller.scrollToAnchor(this.highlightId ?? "");
        });
    }

    isDefaultSort(sort: PersonalDataSort): boolean {
        return sort.key === "firstname" && sort.order === "ascending";
    }

    ngOnInit(): void {
        this.route.queryParamMap.subscribe((params) => {
            const filtersString = params.get("filters");
            this.filters =
                filtersString?.split(",").flatMap((filterString) => {
                    const [key, value] = filterString.split(":");

                    if (key && value && isPersonalDataKey(key)) {
                        return [
                            {
                                type: key,
                                value,
                            },
                        ];
                    }

                    return [];
                }) ?? [];

            const sortString = params.get("sort");
            const [sortKey, sortOrder] = sortString?.split(":") ?? [];
            if (
                sortKey &&
                sortOrder &&
                isPersonalDataKey(sortKey) &&
                isPersonalDataSortOrder(sortOrder)
            ) {
                this.sort = {
                    key: sortKey,
                    order: sortOrder,
                };
            } else {
                this.sort = { key: "firstname", order: "ascending" };
            }

            const pageString = params.get("page") ?? "";
            const page = parseInt(pageString);
            this.currentPage = isNaN(page) ? 1 : page;

            this.loading = true;
            this.updateData();
        });

        this.route.fragment.subscribe(async (fragment) => {
            this.highlightId = fragment ?? "";
        });

        this.paginationMaxSize = window.innerWidth > 600 ? "large" : "small";
    }
}
