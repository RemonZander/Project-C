require('dotenv').config();

const path = require('path');

const routesFolderPath = path.normalize(process.cwd() + "/routes");

const tables = [
    {
        name: "user",
        columns: [
            "Id",
            "Email",
            "Password",
            "Role_Id",
            "Company_Id",
            "Is_logged_on",
        ]
    },
    {
        name: "role",
        columns: [
            "Id",
            "Name",
        ]
    },
    {
        name: "company",
        columns: [
            "Id",
            "Name",
            "Phonenumber",
            "Email",
            "Country",
            "City",
            "Postcode",
            "Streetname",
            "Housenumber",
        ]
    },
    {
        name: "template",
        columns: [
            "Id",
            "Filepath",
            "Company_id",
            "Name",
        ]
    },
    {
        name: "design",
        columns: [
            "Id",
            "Filepath",
            "Created_at",
            "Updated_at",
            "Downloads",
            "Verified",
            "Template_id",
            "Name",
        ]
    },
    {
        name: "image",
        columns: [
            "Id",
            "Filepath",
            "Created_at",
            "Updated_at",
            "Company_id",
        ]
    },
]

for (let i = 0; i < tables.length; i++) {
    const table = tables[i];
}