import { Component, OnInit, inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { PersonalData, personalDataKeysToDisplayMap } from "../personal-data";
import { PersonalDataService } from "../personal-data.service";
import { FormControl, FormGroup } from "@angular/forms";
import Swal from "sweetalert2";

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

    fields = Object.keys(personalDataKeysToDisplayMap).filter(
        (field) => field != "id"
    ) as (keyof PersonalData)[];

    editForm = new FormGroup({
        firstname: new FormControl(""),
        surname: new FormControl(""),
        email: new FormControl(""),
        address: new FormControl<string | undefined>(""),
        place: new FormControl<string | undefined>(""),
        city: new FormControl<string | undefined>(""),
        province: new FormControl<string | undefined>(""),
        note: new FormControl<string | undefined>(""),
    });

    constructor(private route: ActivatedRoute, private router: Router) {}

    displayField(field: keyof PersonalData): string {
        return personalDataKeysToDisplayMap[field];
    }

    submitForm() {
        const data: PersonalData = {
            id: this.personalData?.id ?? "",
            firstname: this.editForm.value.firstname ?? "",
            surname: this.editForm.value.surname ?? "",
            email: this.editForm.value.email ?? "",
            address: this.editForm.value.address ?? undefined,
            place: this.editForm.value.place ?? undefined,
            city: this.editForm.value.city ?? undefined,
            province: this.editForm.value.province ?? undefined,
            note: this.editForm.value.note ?? undefined,
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
        await this.personalDataService.createPersonalData(data);

        this.router.navigate(["/"], {
            fragment: this.personalData?.id.toString(),
        });
    }

    async submitEdit(data: PersonalData) {
        const result = await Swal.fire({
            title: "Confirm edit?",
            showCancelButton: true,
        });

        if (!result.isConfirmed) return;

        await this.personalDataService.editPersonalData(data);
        this.router.navigate(["/"], {
            fragment: this.personalData?.id.toString(),
        });
    }

    cancel() {
        this.router.navigate(["/"], {
            fragment: this.personalData?.id.toString(),
        });
    }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get("id");

        if (!id) {
            // This means we are in the /add path because we have no id paramter
            this.pageFunctionality = PageFunctionality.Create;
            return;
        }

        this.loading = true;
        this.personalDataService.getPersonalDataById(id).then((data) => {
            this.personalData = data;
            this.editForm = new FormGroup({
                firstname: new FormControl(this.personalData.firstname),
                surname: new FormControl(this.personalData.surname),
                email: new FormControl(this.personalData.email),
                address: new FormControl(this.personalData.address),
                place: new FormControl(this.personalData.place),
                city: new FormControl(this.personalData.city),
                province: new FormControl(this.personalData.province),
                note: new FormControl(this.personalData.note),
            });
            this.loading = false;
        });
    }
}
