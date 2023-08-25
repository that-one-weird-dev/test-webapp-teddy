package org.acme.models;

import io.smallrye.common.constraint.NotNull;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Stream;

public record PersonalDataFilter(PersonalDataKey key, String value) {

    /**
     * Example of a valid input:
     * firstname:alberto,email:alb
     */
    public static @NotNull List<PersonalDataFilter> fromFiltersString(String filters) {
        if (filters == null) {
            return List.of();
        }

        return Arrays.stream(filters.split(","))
                .flatMap((filter) -> {
                    final String[] values = filter.split(":");

                    if (values.length != 2) return Stream.of();

                    PersonalDataKey key = PersonalDataKey.fromIdentifier(values[0]);
                    if (key == null) return Stream.of();

                    return Stream.of(new PersonalDataFilter(key, values[1]));
                }).toList();
    }
}
