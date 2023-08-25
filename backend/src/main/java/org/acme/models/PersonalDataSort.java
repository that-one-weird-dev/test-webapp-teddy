package org.acme.models;

import io.smallrye.common.constraint.NotNull;

public record PersonalDataSort(PersonalDataKey key, SortOrder order) {
    public enum SortOrder {
        ASCENDING,
        DESCENDING,
    }

    public static final PersonalDataSort DEFAULT = new PersonalDataSort(PersonalDataKey.FIRSTNAME, SortOrder.ASCENDING);

    /**
     * Examples of a sort string:
     * firstname:asc
     * email:desc
     */
    public static @NotNull PersonalDataSort fromSortString(String sort) {
        if (sort == null) {
            return DEFAULT;
        }

        String[] values = sort.split(":");

        if (values.length != 2) return DEFAULT;

        PersonalDataKey key = PersonalDataKey.fromIdentifier(values[0]);
        if (key == null) return DEFAULT;

        //noinspection SwitchStatementWithTooFewBranches
        SortOrder order = switch (values[1]) {
            case "desc" -> SortOrder.DESCENDING;
            default -> SortOrder.ASCENDING;
        };

        return new PersonalDataSort(key, order);
    }
}
