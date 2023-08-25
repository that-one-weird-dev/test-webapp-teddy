package org.acme.models;

import java.sql.ResultSet;
import java.sql.SQLException;

public record PersonalData(Long id, String firstname, String surname, String email, String address, String place,
                           String city, String province, String notes) {

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
