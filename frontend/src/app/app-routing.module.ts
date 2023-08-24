import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PersonalDataComponent } from "./pages/personal-data/personal-data.component";
import { PersonalDataEditComponent } from "./pages/personal-data-edit/personal-data-edit.component";

const routes: Routes = [
    { path: "", component: PersonalDataComponent },
    { path: "edit/:id", component: PersonalDataEditComponent },
    { path: "new", component: PersonalDataEditComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { anchorScrolling: "enabled" })],
    exports: [RouterModule],
})
export class AppRoutingModule {}
