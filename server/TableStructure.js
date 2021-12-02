module.exports = [
  {
    name: "user",
    columns: [
      "Email",
      "Password",
      "Role_Id",
      "Name",
      "Company_Id",
      "Is_logged_on",
    ],
  },
  {
    name: "role",
    columns: ["Name"],
  },
  {
    name: "company",
    columns: [
      "Name",
      "Phonenumber",
      "Email",
      "Country",
      "City",
      "Postcode",
      "Streetname",
      "Housenumber",
    ],
  },
  {
    name: "template",
    columns: ["Filepath", "Company_Id", "Name"],
  },
  {
    name: "design",
    columns: [
      "Filepath",
      "Created_at",
      "Updated_at",
      "Downloads",
      "Verified",
      "Template_Id",
      "Name",
    ],
  },
  {
    name: "image",
    columns: ["Filepath", "Created_at", "Updated_at", "Company_Id"],
  },
];
