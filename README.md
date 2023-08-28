
# Running the project in development mode
To run in development mode you just need to run the quarkus backend and the angular frontend

### Quarkus
```
cd backend
./mvnw quarkus:dev
```
This runs the quarkus backend in development mode and also starts a docker container of the postgres database.
The database is automatically prepared with the schema and also fake data (only in development)


### Angular
```sh
cd frontend
ng serve
```
This command serves the client locally in development mode at **[localhost:4200](http://localhost:4200)**


## Generating new fake data for the development database
The fake data generation is done via a python script inside of `backend/src/main/resources/scripts` called `fake-data-generation.py`
it accepts the `schema.sql` as input and outputs a new schema file also containing the fake data generated via faker.

To re-generate the data run this command:
```sh
cd backend/src/main/resources/scripts

python fake-data-generation.py schema.sql > schema-fake-data.sql
```