package org.acme.services;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.acme.models.PersonalData;
import org.acme.models.PersonalDataFilter;
import org.acme.models.PersonalDataSort;
import org.acme.repositories.PersonalDataRepository;

import java.sql.SQLException;
import java.util.List;

@ApplicationScoped
public class PersonalDataService {
    @Inject
    PersonalDataRepository repository;

    public List<PersonalData> list(String filtersString, String sortString) throws SQLException {
        List<PersonalDataFilter> filters = PersonalDataFilter.fromFiltersString(filtersString);
        PersonalDataSort sort = PersonalDataSort.fromSortString(sortString);

        return repository.listAll(filters, sort);
    }
}
