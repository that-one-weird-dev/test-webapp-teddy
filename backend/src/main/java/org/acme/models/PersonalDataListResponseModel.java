package org.acme.models;

import org.acme.PersonalDataResource;

import java.util.List;

public record PersonalDataListResponseModel(List<PersonalData> data, int totalCount) {
}
