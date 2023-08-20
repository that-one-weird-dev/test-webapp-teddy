export interface PersonalData {
    id: string;
    firstname: string;
    surname: string;
    email: string;
    address?: string;
    place?: string;
    city?: string;
    province?: string;
    note?: string;
}

/** A dictionary containing the mapping from a key of PersonalData to a displayable string */
export const personalDataKeysToDisplayMap: { [P in keyof PersonalData]-?: string } = {
    "id": "Id",
    "firstname": "First name",
    "surname": "Surname",
    "email": "Email",
    "address": "Address",
    "place": "Place",
    "city": "City",
    "province": "Province",
    "note": "Note",
};
