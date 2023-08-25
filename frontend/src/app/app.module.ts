import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { PersonalDataComponent } from "./pages/personal-data/personal-data.component";
import { PersonalDataEditComponent } from "./pages/personal-data-edit/personal-data-edit.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PaginationModule } from "ngx-bootstrap/pagination";
import { AccordionModule } from "ngx-bootstrap/accordion";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { BsDropdownDirective, BsDropdownModule } from "ngx-bootstrap/dropdown";
import { CommonModule } from "@angular/common";
import { PersonalDataFilterComponent } from "./components/personal-data-filter/personal-data-filter.component";
import { HttpClientModule } from "@angular/common/http";

@NgModule({
    declarations: [
        AppComponent,
        PersonalDataComponent,
        PersonalDataEditComponent,
        NavbarComponent,
        PersonalDataFilterComponent,
    ],
    imports: [
        BrowserModule,
        CommonModule,
        HttpClientModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        PaginationModule.forRoot(),
        FormsModule,
        AccordionModule.forRoot(),
        BsDropdownModule.forRoot(),
    ],
    providers: [
        { provide: BsDropdownDirective, useValue: { autoClose: true } },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
