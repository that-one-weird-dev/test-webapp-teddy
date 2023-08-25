package org.acme.repositories;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.acme.models.PersonalData;
import org.acme.models.PersonalDataFilter;
import org.acme.models.PersonalDataSort;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@ApplicationScoped
public class PersonalDataRepository {
    @Inject
    DataSource dataSource;

    public List<PersonalData> listAll(List<PersonalDataFilter> filters, PersonalDataSort sort) throws SQLException {
        final Connection connection = dataSource.getConnection();

        final String queryString = createQueryStringForListAll(filters, sort);

        final PreparedStatement statement = connection.prepareStatement(queryString);
        appendStatementParametersForListAll(statement, filters);

        final ResultSet resultSet = statement.executeQuery();

        final List<PersonalData> result = new ArrayList<>();
        while (resultSet.next()) {
            result.add(PersonalData.fromResultSet(resultSet));
        }

        connection.close();
        return result;
    }

    public PersonalData find(Long id) throws SQLException {
        final Connection connection = dataSource.getConnection();

        final String queryString = "select * from personal_data where id=?";

        final PreparedStatement statement = connection.prepareStatement(queryString);
        statement.setLong(1, id);

        final ResultSet resultSet = statement.executeQuery();

        if (!resultSet.next()) {
            return null;
        }

        PersonalData result = PersonalData.fromResultSet(resultSet);

        connection.close();
        return result;
    }

    public Long create(PersonalData personalData) throws SQLException {
        final Connection connection = dataSource.getConnection();
        final String queryString = "insert into personal_data " +
                "(firstname, surname, email, address, place, city, province, notes) " +
                "values (?,?,?,?,?,?,?,?) " +
                "returning id";

        final PreparedStatement statement = connection.prepareStatement(queryString);
        appendPersonalDataParameters(statement, personalData);

        ResultSet resultSet = statement.executeQuery();
        resultSet.next();
        Long id = resultSet.getLong("id");

        connection.close();
        return id;
    }

    public void edit(Long id, PersonalData personalData) throws SQLException {
        final Connection connection = dataSource.getConnection();
        final String queryString = "update personal_data " +
                "SET firstname=?, surname=?, email=?, address=?, place=?, city=?, province=?, notes=? " +
                "WHERE id=?";

        final PreparedStatement statement = connection.prepareStatement(queryString);
        appendPersonalDataParameters(statement, personalData);
        statement.setLong(9, id);

        statement.executeUpdate();

        connection.close();
    }

    public void delete(Long id) throws SQLException {
        final Connection connection = dataSource.getConnection();
        final String queryString = "delete from personal_data where id=?";

        final PreparedStatement statement = connection.prepareStatement(queryString);
        statement.setLong(1, id);
        statement.executeUpdate();

        connection.close();
    }

    private static void appendPersonalDataParameters(PreparedStatement statement, PersonalData personalData) throws SQLException {
        statement.setString(1, personalData.firstname());
        statement.setString(2, personalData.surname());
        statement.setString(3, personalData.email());
        statement.setString(4, personalData.address());
        statement.setString(5, personalData.place());
        statement.setString(6, personalData.city());
        statement.setString(7, personalData.province());
        statement.setString(8, personalData.notes());
    }

    private static String createQueryStringForListAll(List<PersonalDataFilter> filters, PersonalDataSort sort) {
        StringBuilder queryString = new StringBuilder("select * from personal_data");

        if (filters.size() > 0) {
            queryString.append(" WHERE");
        }

        for (int i = 0; i < filters.size(); i++) {
            if (i > 0) {
                queryString.append(" AND");
            }

            queryString.append(" ");
            queryString.append(filters.get(i).key().getIdentifier());
            queryString.append("=?");
        }

        queryString.append(" ORDER BY ");
        queryString.append(sort.key().getIdentifier());

        queryString.append(switch (sort.order()) {
            case ASCENDING -> " ASC";
            case DESCENDING -> " DESC";
        });

        return queryString.toString();
    }

    private static void appendStatementParametersForListAll(PreparedStatement statement,
                                                     List<PersonalDataFilter> filters) throws SQLException {
        int parameterId = 1;

        for (PersonalDataFilter filter : filters) {
            statement.setString(parameterId++, filter.value());
        }
    }
}
