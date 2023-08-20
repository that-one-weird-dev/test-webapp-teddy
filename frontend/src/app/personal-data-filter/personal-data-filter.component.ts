import { Component, EventEmitter, Input, Output } from "@angular/core";
import { PersonalData, personalDataKeysToDisplayMap } from "../personal-data";
import { FormControl, FormGroup } from "@angular/forms";
import { PersonalDataFilter } from "../personal-data-filter";
import { PersonalDataSort } from "../personal-data-sort";

@Component({
    selector: "personal-data-filter",
    templateUrl: "./personal-data-filter.component.html",
})
export class PersonalDataFilterComponent {
    @Output() filtersAdded = new EventEmitter<PersonalDataFilter[]>();
    @Output() filterRemoved = new EventEmitter<PersonalDataFilter>();
    @Output() sortChanged = new EventEmitter<PersonalDataSort>();

    @Input() filters: PersonalDataFilter[] = [];
    @Input() sort: PersonalDataSort = {
        key: "firstname",
        order: "ascending",
    };

    fields = Object.keys(
        personalDataKeysToDisplayMap
    ) as (keyof PersonalData)[];

    propertyForm = new FormGroup({
        type: new FormControl<keyof PersonalData>("firstname"),
        value: new FormControl(""),
    });

    displayField(field: keyof PersonalData): string {
        return personalDataKeysToDisplayMap[field];
    }

    updateSort(sortOverlay: Partial<PersonalDataSort>) {
        this.sort = {
            ...this.sort,
            ...sortOverlay,
        };
        this.sortChanged.emit(this.sort);
    }

    removeFilter(filter: PersonalDataFilter) {
        this.filterRemoved.emit(filter);
    }

    submitFilter(event: SubmitEvent) {
        const filters = this.propertyForm.value.value
            ?.split(" ")
            .filter((tag) => tag.length > 0)
            .map((tag) => ({
                type: this.propertyForm.value.type ?? "firstname",
                value: tag,
            }));

        this.filtersAdded.emit(filters);

        this.propertyForm.setValue({
            type: "firstname",
            value: "",
        });
    }
}
