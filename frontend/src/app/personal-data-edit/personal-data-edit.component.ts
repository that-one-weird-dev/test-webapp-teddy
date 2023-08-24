import { Component, OnInit, inject } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { PersonalData, personalDataKeysToDisplayMap } from "../personal-data";
import { PersonalDataService } from "../personal-data.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import Swal from "sweetalert2";
import { PersonalDataListPageSize } from "../personal-data/personal-data.component";

enum PageFunctionality {
    Create,
    Edit,
}

@Component({
    selector: "personal-data-edit",
    templateUrl: "./personal-data-edit.component.html",
})
export class PersonalDataEditComponent implements OnInit {
    loading: boolean = false;
    pageFunctionality: PageFunctionality = PageFunctionality.Edit;
    personalData?: PersonalData;
    personalDataService: PersonalDataService = inject(PersonalDataService);
    confirmedAtLeastOnce: boolean = false;

    editForm = new FormGroup({
        firstname: new FormControl("", Validators.required),
        surname: new FormControl("", Validators.required),
        email: new FormControl("", [Validators.required, Validators.email]),
        address: new FormControl<string | undefined>(""),
        place: new FormControl<string | undefined>(""),
        city: new FormControl<string | undefined>(""),
        province: new FormControl<string | undefined>(""),
        note: new FormControl<string | undefined>(""),
    });

    constructor(private route: ActivatedRoute, private router: Router) {}

    submitForm() {
        this.confirmedAtLeastOnce = true;
        if (!this.editForm.valid) return;

        const data: PersonalData = {
            id: this.personalData?.id ?? "",
            firstname: this.editForm.value.firstname ?? "",
            surname: this.editForm.value.surname ?? "",
            email: this.editForm.value.email ?? "",
            address: this.editForm.value.address ?? undefined,
            place: this.editForm.value.place ?? undefined,
            city: this.editForm.value.city ?? undefined,
            province: this.editForm.value.province ?? undefined,
            notes: this.editForm.value.note ?? undefined,
        };

        switch (this.pageFunctionality) {
            case PageFunctionality.Create:
                this.submitCreate(data);
                break;
            case PageFunctionality.Edit:
                this.submitEdit(data);
                break;
        }
    }

    async submitCreate(data: PersonalData) {
        const id = await this.personalDataService.createPersonalData(data);

        this.navigateToHomepage(id);
    }

    async submitEdit(data: PersonalData) {
        const result = await Swal.fire({
            title: "Confirm edit?",
            showCancelButton: true,
        });

        if (!result.isConfirmed) return;

        await this.personalDataService.editPersonalData(data);
        this.navigateToHomepage(this.personalData?.id);
    }

    cancel() {
        this.navigateToHomepage();
    }

    checkInvalid(field: string): boolean {
        return (
            !!this.editForm.get(field)?.errors &&
            !this.loading &&
            this.confirmedAtLeastOnce
        );
    }

    checkInvalidValidator(field: string, validator: string): boolean {
        return (
            !!this.editForm.get(field)?.errors?.[validator] &&
            !this.loading &&
            this.confirmedAtLeastOnce
        );
    }

    async navigateToHomepage(id?: string) {
        if (!id) {
            this.router.navigate(["/"]);
            return;
        }

        const index = await this.personalDataService.findRowIndexOfId(id);
        const page = Math.floor(index / PersonalDataListPageSize) + 1;

        this.router.navigate(["/"], {
            fragment: id,
            queryParams: {
                page,
            },
        });
    }

    ngOnInit(): void {
        this.route.paramMap.subscribe((params) => {
            const id = params.get('id');

            if (!id) {
                // This means we are in the /add path because we have no id paramter
                this.pageFunctionality = PageFunctionality.Create;
                return;
            }

            this.loading = true;
            this.personalDataService.getPersonalDataById(id).then((data) => {
                this.personalData = data;

                this.editForm.setValue({
                    firstname: this.personalData.firstname,
                    surname: this.personalData.surname,
                    email: this.personalData.email,
                    address: this.personalData.address,
                    place: this.personalData.place,
                    city: this.personalData.city,
                    province: this.personalData.province,
                    note: this.personalData.notes,
                });
                this.loading = false;
            });
        });
    }
}
