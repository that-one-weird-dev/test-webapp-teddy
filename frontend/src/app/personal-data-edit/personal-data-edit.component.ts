import { Component, OnInit, inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { PersonalData } from "../personal-data";
import { PersonalDataService } from "../personal-data.service";
import { FormControl, FormGroup } from "@angular/forms";
import Swal from "sweetalert2";

@Component({
    selector: "personal-data-edit",
    templateUrl: "./personal-data-edit.component.html",
})
export class PersonalDataEditComponent implements OnInit {
    loading: boolean = false;
    personalData?: PersonalData;
    personalDataService: PersonalDataService = inject(PersonalDataService);

    editForm = new FormGroup({
        firstname: new FormControl(""),
        surname: new FormControl(""),
        email: new FormControl(""),
    });

    constructor(private route: ActivatedRoute, private router: Router) {}

    async submitEdit() {
        const result = await Swal.fire({
            title: "Confirm edit?",
            showCancelButton: true,
        });

        if (!result.isConfirmed) return;

        const newData: PersonalData = {
            id: this.personalData!.id,
            firstname: this.editForm.value.firstname ?? "",
            surname: this.editForm.value.surname ?? "",
            email: this.editForm.value.email ?? "",
        };

        await this.personalDataService.editPersonalData(newData);
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
        const idString = this.route.snapshot.paramMap.get("id");

        if (idString == null) {
            // This means we are in the /add path because we have no id paramter
            return;
        }

        const id = parseInt(idString || "");
        if (isNaN(id)) {
            // This means we an invalid id parameter so we return to the homepage
            this.router.navigate(["/"], { fragment: id.toString() });
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
