package org.acme.services;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.acme.models.*;
import org.acme.repositories.PersonalDataRepository;

import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class PersonalDataService {
    @Inject
    PersonalDataRepository repository;

    private static final Integer DEFAULT_PAGE = 0;
    private static final Integer DEFAULT_PAGE_SIZE = 10;

    public List<PersonalData> list(String filtersString, String sortString, Optional<Integer> page, Optional<Integer> pageSize) throws SQLException {
        List<PersonalDataFilter> filters = PersonalDataFilter.fromFiltersString(filtersString);
        PersonalDataSort sort = PersonalDataSort.fromSortString(sortString);

        return repository.listAll(filters, sort, page.orElse(DEFAULT_PAGE), pageSize.orElse(DEFAULT_PAGE_SIZE));
    }

    public PersonalData get(Long id) throws SQLException {
        return repository.find(id);
    }

    public PersonalDataCreateResponseModel create(PersonalData personalData) throws SQLException {
        Long id = repository.create(personalData);

        return new PersonalDataCreateResponseModel(id);
    }

    public EmptyResponseModel edit(Long id, PersonalData personalData) throws SQLException {
        repository.edit(id, personalData);

        return new EmptyResponseModel();
    }

    public EmptyResponseModel delete(Long id) throws SQLException {
        repository.delete(id);

        return new EmptyResponseModel();
    }
}
