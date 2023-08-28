package org.acme;

import contstants.ErrorMessages;
import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;
import org.acme.models.PersonalData;
import org.acme.models.ResponseModel;
import org.hamcrest.Matcher;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.*;

@QuarkusTest
public class PersonalDataResourcesTest {

    @Test
    public void testCreateInvalidData() {
        final PersonalData data = new PersonalData(0L, "invalid name", "invalid surname",
                "invalid@email",null, null,
                null, null, null);

        given()
                .contentType(ContentType.JSON)
                .body(data)
                .when().post("/api/personal-data")
                .then()
                    .statusCode(200)
                    .contentType(ContentType.JSON)
                    .body("error", is(ErrorMessages.InvalidData));
    }

    @Test
    public void testCreateValidData() {
        final PersonalData data = new PersonalData(0L, "Name", "Surname",
                "valid@mail.real", null, null,
                null, null, null);

        given()
                .contentType(ContentType.JSON)
                .body(data)
                .when().post("/api/personal-data")
                .then()
                    .statusCode(200)
                    .body("error", nullValue());
    }

    @Test
    public void testListData() {
        given()
                .when().get("/api/personal-data")
                .then()
                    .statusCode(200)
                    .body("error", nullValue())
                    .body("data", notNullValue());
    }

    @Test
    public void testGetSpecificData() {
        given()
                .when().get("/api/personal-data/1")
                .then()
                    .statusCode(200)
                    .body("data.id", is(1));
    }

    @Test
    public void testPageOf() {
        given()
                .when().get("/api/personal-data/page-of/1")
                .then()
                    .statusCode(200)
                    .body("data.page", notNullValue());
    }

    @Test
    public void testDelete() {
        given()
                .when().delete("/api/personal-data/1")
                .then()
                    .statusCode(200);

        given()
                .when().get("/api/personal-data/1")
                .then()
                    .statusCode(200)
                    .body("data", nullValue());
    }
}