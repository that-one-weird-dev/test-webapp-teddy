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

        String queryString = createQueryStringForListAll(filters, sort);

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

    private String createQueryStringForListAll(List<PersonalDataFilter> filters, PersonalDataSort sort) {
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

    private void appendStatementParametersForListAll(PreparedStatement statement,
                                                     List<PersonalDataFilter> filters) throws SQLException {
        int parameterId = 1;

        for (PersonalDataFilter filter : filters) {
            statement.setString(parameterId++, filter.value());
        }
    }
}
