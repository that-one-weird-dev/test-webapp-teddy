import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { PersonalDataComponent } from "./personal-data/personal-data.component";
import { PersonalDataEditComponent } from "./personal-data-edit/personal-data-edit.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PaginationModule } from "ngx-bootstrap/pagination";
import { AccordionModule } from "ngx-bootstrap/accordion";
import { NavbarComponent } from "./navbar/navbar.component";
import { BsDropdownConfig, BsDropdownDirective, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CommonModule } from "@angular/common";
import { PersonalDataFilterComponent } from './personal-data-filter/personal-data-filter.component';

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
        AppRoutingModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        PaginationModule.forRoot(),
        FormsModule,
        AccordionModule.forRoot(),
        BsDropdownModule.forRoot(),
    ],
    providers: [
        { provide: BsDropdownDirective, useValue: { autoClose: true} }
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
