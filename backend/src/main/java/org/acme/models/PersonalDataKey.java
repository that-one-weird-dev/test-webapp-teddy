package org.acme.models;

import java.util.Objects;

public enum PersonalDataKey {
    ID("id"),
    FIRSTNAME("firstname"),
    SURNAME("surname"),
    EMAIL("email"),
    ADDRESS("address"),
    PLACE("place"),
    CITY("city"),
    PROVINCE("province"),
    NOTES("notes");

    private final String identifier;
    PersonalDataKey(final String key) {
        this.identifier = key;
    }

    public String getIdentifier() {
        return this.identifier;
    }

    public static PersonalDataKey fromIdentifier(String key) {
        for (PersonalDataKey prop : PersonalDataKey.values()) {
            if (Objects.equals(prop.identifier, key)) {
                return prop;
            }
        }

        return null;
    }
}
