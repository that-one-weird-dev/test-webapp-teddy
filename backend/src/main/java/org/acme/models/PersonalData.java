package org.acme.models;

import java.sql.ResultSet;
import java.sql.SQLException;

public record PersonalData(Long id, String firstname, String surname, String email, String address, String place,
                           String city, String province, String notes) {

    public boolean isValid() {
        return firstname() != null
                && surname() != null
                && email() != null
                && !firstname().isBlank()
                && !surname().isBlank()
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
