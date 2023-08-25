
CREATE TABLE IF NOT EXISTS personal_data (
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(50) NOT NULL,
    surname VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    address VARCHAR(255),
    place VARCHAR(255),
    city VARCHAR(255),
    province VARCHAR(255),
    notes VARCHAR(255)
)