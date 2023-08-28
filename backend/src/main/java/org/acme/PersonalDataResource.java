package org.acme;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import org.acme.models.*;
import org.acme.services.PersonalDataService;
import org.jboss.resteasy.reactive.RestQuery;

import java.sql.SQLException;
import java.util.Optional;

@Path("/api/personal-data")
@Produces(MediaType.APPLICATION_JSON)
public class PersonalDataResource {
    @Inject
    PersonalDataService service;

    @GET
    public ResponseModel<PersonalDataListResponseModel> list(
            @RestQuery String filters, @RestQuery String sort,
            @RestQuery Optional<Integer> page, @RestQuery Optional<Integer> pageSize) {
        try {
            return new ResponseModel<>(service.list(filters, sort, page, pageSize));
        } catch (SQLException ex) {
            return new ResponseModel<>("Error while listing personal personalData");
        }
    }

    @GET
    @Path("/{id}")
    public ResponseModel<PersonalData> get(Long id) {
        try {
            PersonalData data = service.get(id);
            if (data == null) {
                return new ResponseModel<>("Requested personalData does not exist");
            }

            return new ResponseModel<>(data);
        } catch (SQLException ex) {
            return new ResponseModel<>("Error while listing personal personalData");
        }
    }

    @GET
    @Path("/page-of/{id}")
    public ResponseModel<PersonalDataPageFromIdResponseModel> pageFromId(
            Long id,
            @RestQuery Optional<Integer> pageSize) {

        try {
            return new ResponseModel<>(service.pageFromId(id, pageSize));
        } catch (SQLException ex) {
            return new ResponseModel<>("Error while finding the page of id");
        }
    }

    @POST
    public ResponseModel<PersonalDataCreateResponseModel> create(PersonalData personalData) {
        try {
            return service.create(personalData);
        } catch (SQLException ex) {
            return new ResponseModel<>("Error while creating personal personalData");
        }
    }

    @PUT
    @Path("/{id}")
    public ResponseModel<EmptyResponseModel> edit(Long id, PersonalData personalData) {
        try {
            return service.edit(id, personalData);
        } catch (Exception ex) {
            return new ResponseModel<>("Error while editing personal personalData");
        }
    }

    @DELETE
    @Path("/{id}")
    public ResponseModel<EmptyResponseModel> delete(Long id) {
        try {
            return new ResponseModel<>(service.delete(id));
        } catch (Exception ex) {
            return new ResponseModel<>("Error while editing personal personalData");
        }
    }
}
