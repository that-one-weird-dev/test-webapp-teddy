const { faker } = require("@faker-js/faker");

function createPersonalData(id) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email({
        firstName,
        lastName,
    })

    return {
        id: faker.string.alphanumeric(8),
        email,
        firstname: firstName,
        surname: lastName,
        address: faker.location.streetAddress(),
        place: faker.location.city(),
        city: faker.location.city(),
        province: faker.location.county(),
        notes: faker.person.bio(),
    };
}

module.exports = () => {
    const personalData = Array(587)
        .fill(null)
        .map((_, i) => createPersonalData(i));

    return {
        "personal-data": personalData
    };
}