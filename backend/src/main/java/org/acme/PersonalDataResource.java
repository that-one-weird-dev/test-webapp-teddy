package org.acme;

import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import org.acme.models.PersonalData;
import org.acme.models.ResponseModel;
import org.acme.services.PersonalDataService;
import org.jboss.resteasy.reactive.RestQuery;

import java.sql.SQLException;
import java.util.List;

@Path("/api/personal-data")
public class PersonalDataResource {
    @Inject
    PersonalDataService service;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public ResponseModel<List<PersonalData>> list(
        @RestQuery String filters,
        @RestQuery String sort
    ) {
        try {
            return new ResponseModel<>(service.list(filters, sort));
        } catch(SQLException ex) {
            return new ResponseModel<>("Server error");
        }
    }
}
