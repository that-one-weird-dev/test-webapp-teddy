import { Component, OnInit, inject } from "@angular/core";
import { PersonalData } from "../personal-data";
import { PersonalDataService } from "../personal-data.service";
import { ActivatedRoute, Router } from "@angular/router";
import { PageChangedEvent } from "ngx-bootstrap/pagination";
import Swal from "sweetalert2";

@Component({
    selector: "personal-data",
    templateUrl: "./personal-data.component.html",
    styleUrls: ["./personal-data.component.scss"],
})
export class PersonalDataComponent implements OnInit {
    /** This is the actual current page */
    currentPage: number = 1;
    /** and this is the page that the pagination component displays.
     *  This is used because otherwise the pagination component would fire a pageChanged event
     *  every time the currentPage is changed meaning double the rest api calls, which is no good :(
    */
    currentPaginationPage: number = 1;
    pageSize: number = 10;
    totalItems: number = 100;
    loading: boolean = true;
    highlightIndex?: number;

    personalData!: PersonalData[];
    personalDataService: PersonalDataService = inject(PersonalDataService);

    constructor(private route: ActivatedRoute, private router: Router) {}

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

        this.loading = true
        await this.personalDataService.deletePersonalData(data.id);
        await this.updateData()
    }

    async updateData() {
        const data = await this.personalDataService.getPaginatedPersonalData(
            this.currentPage,
            this.pageSize
        );

        this.personalData = data.personalData;
        this.totalItems = data.totalCount;
        this.loading = false;
        this.currentPaginationPage = this.currentPage;
    }

    pageChanged(event: PageChangedEvent) {
        if (event.page == this.currentPage) return;

        this.currentPage = event.page;
        this.loading = true
        this.updateData();
        this.highlightIndex = undefined;
    }

    ngOnInit(): void {
        const highlight = this.route.snapshot.fragment;
        const highlightId = parseInt(highlight ?? "");

        if (!isNaN(highlightId)) {
            this.currentPage = highlightId / this.pageSize + 1;
            this.highlightIndex = highlightId % this.pageSize;
        }

        this.updateData()
    }
}
