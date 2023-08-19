import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PersonalDataComponent } from "./personal-data/personal-data.component";
import { PersonalDataEditComponent } from "./personal-data-edit/personal-data-edit.component";

const routes: Routes = [
    { path: "", component: PersonalDataComponent },
    { path: "edit/:id", component: PersonalDataEditComponent },
    { path: "add", component: PersonalDataEditComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
