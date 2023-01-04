import { check } from 'express-validator'

export const users = (method) => {
    switch (method) {
        case "register": {
            return [
                check("firstName", "First Name is required.").not().isEmpty(),
                check("lastName", "Last Name is required.").not().isEmpty(),
                check("email", "Email is required.").isEmail(),
                check("designation", "Designation is required.").not().isEmpty(),
                check("dateOfBirth", "Date Of Birth is required.").not().isEmpty(),
                // check("active", "Profile pic is required.").not().isEmpty(),
            ];
        }
        default: {
            return [];
        }
    }
};

export const company = (method) => {
    switch (method) {
        case "register": {
            return [
                check("name", " Name is required.").not().isEmpty(),
                check("address", "address is required.").not().isEmpty(),
                check("location", "location is required.").not().isEmpty()
            ];
        }
        case "addOrRemove": {
            return [
                check("name", " Name is required.").not().isEmpty(),
                check("address", "address is required.").not().isEmpty(),
                check("location", "location is required.").not().isEmpty()
            ];
        }
        case "migrate": {
            return [
                check("fromCompanyId", " Name is required.").not().isEmpty(),
                check("userId", "address is required.").not().isEmpty(),
                check("toCompanyId", "location is required.").not().isEmpty()
            ];
        }
        default: {
            return [];
        }
    }
};