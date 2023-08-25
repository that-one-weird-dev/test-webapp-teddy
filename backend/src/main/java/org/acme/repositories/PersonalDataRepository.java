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
import java.util.Optional;

@ApplicationScoped
public class PersonalDataRepository {
    @Inject
    DataSource dataSource;

    public List<PersonalData> listAll(
            List<PersonalDataFilter> filters, PersonalDataSort sort,
            Integer page, Integer pageSize) throws SQLException {

        final Connection connection = dataSource.getConnection();

        final String queryString = createQueryStringForListAll(filters, sort, page, pageSize);

        final PreparedStatement statement = connection.prepareStatement(queryString);
        appendFiltersParameters(statement, filters);

        final ResultSet resultSet = statement.executeQuery();

        final List<PersonalData> result = new ArrayList<>();
        while (resultSet.next()) {
            result.add(PersonalData.fromResultSet(resultSet));
        }

        resultSet.close();
        statement.close();
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

        resultSet.close();
        statement.close();
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

        resultSet.close();
        statement.close();
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

        statement.close();
        connection.close();
    }

    public void delete(Long id) throws SQLException {
        final Connection connection = dataSource.getConnection();
        final String queryString = "delete from personal_data where id=?";

        final PreparedStatement statement = connection.prepareStatement(queryString);
        statement.setLong(1, id);
        statement.executeUpdate();

        statement.close();
        connection.close();
    }

    public int countAll() throws SQLException {
        final Connection connection = dataSource.getConnection();

        final String queryString = "select count(*) as total_count from personal_data";
        final PreparedStatement statement = connection.prepareStatement(queryString);
        final ResultSet resultSet = statement.executeQuery();

        resultSet.next();
        int totalCount = resultSet.getInt("total_count");

        resultSet.close();
        statement.close();
        connection.close();

        return totalCount;
    }

    public Optional<Integer> indexOfId(Long id) throws SQLException {
        final Connection connection = dataSource.getConnection();

        final StringBuilder queryString = new StringBuilder();
        queryString.append("SELECT row_number FROM (");
        queryString.append("SELECT ROW_NUMBER() OVER() as row_number, pd.id FROM personal_data pd");
        appendSortOrderByClause(queryString, PersonalDataSort.DEFAULT);
        queryString.append(") x WHERE x.id=?");

        final PreparedStatement statement = connection.prepareStatement(queryString.toString());
        statement.setLong(1, id);

        final ResultSet resultSet = statement.executeQuery();

        if (!resultSet.next()) {
            return Optional.empty();
        }

        final int index = resultSet.getInt("row_number");

        resultSet.close();
        statement.close();
        connection.close();

        return Optional.of(index);
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

    private static String createQueryStringForListAll(List<PersonalDataFilter> filters, PersonalDataSort sort,
                                                      Integer page, Integer pageSize) {

        StringBuilder queryString = new StringBuilder("select * from personal_data");

        appendFiltersWhereClause(queryString, filters);
        appendSortOrderByClause(queryString, sort);

        queryString.append(" LIMIT ");
        queryString.append(pageSize);

        queryString.append(" OFFSET ");
        queryString.append(page * pageSize);

        return queryString.toString();
    }

    private static void appendFiltersWhereClause(StringBuilder queryString, List<PersonalDataFilter> filters) {
        if (filters.size() > 0) {
            queryString.append(" WHERE");
        }

        for (int i = 0; i < filters.size(); i++) {
            if (i > 0) {
                queryString.append(" AND");
            }

            queryString.append(" ");
            queryString.append(filters.get(i).key().getIdentifier());
            queryString.append(" LIKE ?");
        }
    }

    private static void appendSortOrderByClause(StringBuilder queryString, PersonalDataSort sort) {
        queryString.append(" ORDER BY ");
        queryString.append(sort.key().getIdentifier());

        queryString.append(switch (sort.order()) {
            case ASCENDING -> " ASC";
            case DESCENDING -> " DESC";
        });
    }

    private static void appendFiltersParameters(PreparedStatement statement,
                                                List<PersonalDataFilter> filters) throws SQLException {
        int parameterId = 1;

        for (PersonalDataFilter filter : filters) {
            statement.setString(parameterId++, "%" + filter.value() + "%");
        }
    }
}
