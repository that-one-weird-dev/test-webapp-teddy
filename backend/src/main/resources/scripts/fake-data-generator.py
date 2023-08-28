from faker import Faker
import sys

if len(sys.argv) < 2:
    print("Invalid argument count")
    print("Expected arguments: <base file>")
    sys.exit(1)


FAKE_USER_COUNT = 512

fake = Faker("it_IT")

output = ""

with open(sys.argv[1]) as file:
    output += file.read()
    output += "\n"

statementPattern = """INSERT INTO personal_data (firstname, surname, email, address, place, city, province) VALUES ('{}', '{}', '{}', '{}', '{}', '{}', '{}');\n"""
for _ in range(FAKE_USER_COUNT):
    statement = statementPattern.format(
        fake.first_name().replace("'", " "),
        fake.last_name().replace("'", " "),
        fake.email().replace("'", " "),
        fake.street_address().replace("'", " "),
        fake.city().replace("'", " "),
        fake.city().replace("'", " "),
        fake.postcode_city_province().replace("'", " "),
    )
    output += statement

print(output)