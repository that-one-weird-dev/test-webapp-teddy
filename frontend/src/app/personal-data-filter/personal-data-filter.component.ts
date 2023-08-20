import { Component, EventEmitter, Output } from "@angular/core";
import { PersonalData, personalDataKeysToDisplayMap } from "../personal-data";
import { FormControl, FormGroup } from "@angular/forms";
import { PersonalDataFilter } from "../personal-data-filter";
import { PersonalDataSort } from "../personal-data-sort";

@Component({
    selector: "personal-data-filter",
    templateUrl: "./personal-data-filter.component.html",
})
export class PersonalDataFilterComponent {
    @Output() filtersChanged = new EventEmitter<typeof this.filters>();
    @Output() sortChanged = new EventEmitter<typeof this.sort>();

    filters: PersonalDataFilter[] = [];
    sort: PersonalDataSort = {
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
        this.filters = this.filters.filter((f) => f != filter);
        this.filtersChanged.emit(this.filters);
    }

    submitFilter(event: SubmitEvent) {
        this.propertyForm.value.value
            ?.split(" ")
            .filter((tag) => tag.length > 0)
            .forEach((tag) => {
                this.filters.push({
                    type: this.propertyForm.value.type ?? "firstname",
                    value: tag,
                });
            });

        this.filtersChanged.emit(this.filters);

        this.propertyForm.setValue({
            type: "firstname",
            value: "",
        });
    }
}
