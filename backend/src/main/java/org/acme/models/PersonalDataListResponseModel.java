package org.acme.models;

import java.util.List;

public record PersonalDataListResponseModel(List<PersonalData> personalData, int totalCount) {
}
