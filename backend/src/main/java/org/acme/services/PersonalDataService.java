package org.acme.services;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.acme.models.*;
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
