import { Component, OnInit, inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { PersonalData } from "../personal-data";
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

    editForm = new FormGroup({
        firstname: new FormControl(""),
        surname: new FormControl(""),
        email: new FormControl(""),
    });

    constructor(private route: ActivatedRoute, private router: Router) {}

    submitForm() {
        const data: PersonalData = {
            id: this.personalData?.id ?? 0,
            firstname: this.editForm.value.firstname ?? "",
            surname: this.editForm.value.surname ?? "",
            email: this.editForm.value.email ?? "",
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
            });
            this.loading = false;
        });
    }
}
