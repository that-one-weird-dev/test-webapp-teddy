package org.acme.models;

import java.sql.ResultSet;
import java.sql.SQLException;

public record PersonalData(Long id, String firstname, String surname, String email, String address, String place,
                           String city, String province, String notes) {

    @Override
    public String firstname() {
        return Character.toUpperCase(firstname.charAt(0)) + firstname.substring(1).toLowerCase();
    }

    @Override
    public String surname() {
        return Character.toUpperCase(surname.charAt(0)) + surname.substring(1).toLowerCase();
    }

    public boolean isValid() {
        return firstname != null
                && !firstname().isBlank()
                && !firstname.contains(" ")
                && surname != null
                && !surname().isBlank()
                && !surname.contains(" ")
                && email != null
                && email().matches("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$");
    }

    public static PersonalData fromResultSet(final ResultSet resultSet) throws SQLException {
        return new PersonalData(
                resultSet.getLong("id"),
                resultSet.getString("firstname"),
                resultSet.getString("surname"),
                resultSet.getString("email"),
                resultSet.getString("address"),
                resultSet.getString("place"),
                resultSet.getString("city"),
                resultSet.getString("province"),
                resultSet.getString("notes")
        );
    }
}
