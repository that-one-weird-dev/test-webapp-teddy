package org.acme.services;

import contstants.ErrorMessages;
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

    public PersonalDataListResponseModel list(String filtersString, String sortString, Optional<Integer> page, Optional<Integer> pageSize) throws SQLException {
        List<PersonalDataFilter> filters = PersonalDataFilter.fromFiltersString(filtersString);
        PersonalDataSort sort = PersonalDataSort.fromSortString(sortString);

        List<PersonalData> data = repository.listAll(filters, sort, page.orElse(DEFAULT_PAGE), pageSize.orElse(DEFAULT_PAGE_SIZE));
        int totalCount = repository.countAll();

        return new PersonalDataListResponseModel(data, totalCount);
    }

    public PersonalData get(Long id) throws SQLException {
        return repository.find(id);
    }

    public ResponseModel<PersonalDataCreateResponseModel> create(PersonalData personalData) throws SQLException {
        if (!personalData.isValid()) {
            return new ResponseModel<>(ErrorMessages.InvalidData);
        }

        Long id = repository.create(personalData);

        return new ResponseModel<>(new PersonalDataCreateResponseModel(id));
    }

    public ResponseModel<EmptyResponseModel> edit(Long id, PersonalData personalData) throws SQLException {
        if (!personalData.isValid()) {
            return new ResponseModel<>(ErrorMessages.InvalidData);
        }

        repository.edit(id, personalData);

        return new ResponseModel<>(new EmptyResponseModel());
    }

    public EmptyResponseModel delete(Long id) throws SQLException {
        repository.delete(id);

        return new EmptyResponseModel();
    }

    public PersonalDataPageFromIdResponseModel pageFromId(Long id, Optional<Integer> pageSize) throws SQLException {
        int index = repository.indexOfId(id).orElse(0);

        int page = (index - 1) / DEFAULT_PAGE_SIZE;

        return new PersonalDataPageFromIdResponseModel(page);
    }
}
