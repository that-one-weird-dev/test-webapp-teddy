package org.acme;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import org.acme.models.PersonalData;
import org.acme.models.PersonalDataCreateResponseModel;
import org.acme.models.EmptyResponseModel;
import org.acme.models.ResponseModel;
import org.acme.services.PersonalDataService;
import org.jboss.resteasy.reactive.RestQuery;

import java.sql.SQLException;
import java.util.List;

@Path("/api/personal-data")
@Produces(MediaType.APPLICATION_JSON)
public class PersonalDataResource {
    @Inject
    PersonalDataService service;

    @GET
    public ResponseModel<List<PersonalData>> list(
            @RestQuery String filters,
            @RestQuery String sort
    ) {
        try {
            return new ResponseModel<>(service.list(filters, sort));
        } catch (SQLException ex) {
            return new ResponseModel<>("Error while listing personal data");
        }
    }

    @GET
    @Path("/{id}")
    public ResponseModel<PersonalData> get(Long id) {
        try {
            PersonalData data = service.get(id);
            if (data == null) {
                return new ResponseModel<>("Requested data does not exist");
            }

            return new ResponseModel<>(data);
        } catch (SQLException ex) {
            return new ResponseModel<>("Error while listing personal data");
        }
    }

    @POST
    public ResponseModel<PersonalDataCreateResponseModel> create(PersonalData personalData) {
        try {
            return new ResponseModel<>(service.create(personalData));
        } catch (SQLException ex) {
            return new ResponseModel<>("Error while creating personal data");
        }
    }

    @PUT
    @Path("/{id}")
    public ResponseModel<EmptyResponseModel> edit(Long id, PersonalData personalData) {
        try {
            return new ResponseModel<>(service.edit(id, personalData));
        } catch (Exception ex) {
            return new ResponseModel<>("Error while editing personal data");
        }
    }

    @DELETE
    @Path("/{id}")
    public ResponseModel<EmptyResponseModel> delete(Long id) {
        try {
            return new ResponseModel<>(service.delete(id));
        } catch (Exception ex) {
            return new ResponseModel<>("Error while editing personal data");
        }
    }
}
