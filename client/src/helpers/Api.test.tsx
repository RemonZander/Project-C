import Api from './Api';

const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibmFhbSI6IkFtYWRldXMgTW96YXJ0IiwiY29tcGFueSI6LTEsInR5cGUiOiJBZG1pbiJ9.NhqAZBmSlwQYj3BlefmcrEBFE5Dd6jfP0T5TFFXDwT0"
const ApiInstance = new Api(token);

//==============ALL
test("ALL: database server staat aan en bevat relevante data in juiste format", async () => {
        let db = await ApiInstance.all('user');
        let users = db.content;
        expect(users).toBe(
                expect.arrayContaining([expect.any(Object)]
                )
        );
});

test("ALL: database server staat uit getTemplates", async () => {
        expect(await ApiInstance.all('user')).toThrowError();
});

test("ALL: database bevat geen data", async () => {
        for (let index = 1; index <= 27; index++) {
            await ApiInstance.delete('user',index);
        };

        const db = await ApiInstance.all('user');
        const realArray = db.content;
        console.log(realArray);
        expect(realArray).toHaveLength(0); 
 });

//==============READ
test("READ: database server staat aan en bevat relevante data in juiste format", async () => {
    let testUser = {
        Company_Id: -1,
        Email: "admin@gmail.com",
        Id: 1,
        Name: "Amadeus Mozart",
        Password: "Admin1!",
        Role_Id: 1,
    };
    let userObject = await ApiInstance.read('user', 1);
    let user = userObject.content[0];
        expect(user).toEqual(
                expect.arrayContaining([testUser])
        );
});

test("READ: database server staat uit (UITVOEREN MET SERVER UIT)", async () => {
    expect(await ApiInstance.read('user', 1)).toThrowError();
});

test("READ: database bevat geen data", async () => {
        for (let index = 1; index <= 27; index++) {
            await ApiInstance.delete('user',index);
        };

        expect(await ApiInstance.read('user', 1)).toThrowError();
});

test("READ: should throw error after giving a non-existent field as parameter for read", async () => {
    expect(await ApiInstance.read('animals', 1)).toThrowError();
});

//============CREATE
test("CREATE: should create data for the requested database", async () => {
    let testUser = {
                Company_Id: 7,
                Email: "test@gmail.com",
                Id: 28,
                Name: "test",
                Password: "wachtwoord123",
                Role_Id: 1,
        }
    await ApiInstance.create('user', [
            "test@gmail.com",
            "wachtwoord123",
            "1",
            "test",
            "7",
        ]);

    let userObject = await ApiInstance.read('user', 28);
    let user = userObject.content[0];

    expect(user).toEqual(
            expect.arrayContaining([testUser])
    );
});

test("CREATE: database server staat uit (UITVOEREN MET SERVER UIT)", async () => {
    let testUser = [
        "test@gmail.com",
        "wachtwoord123",
        "1",
        "test",
        "7",
    ];
    expect(await ApiInstance.create('user', testUser)).toThrowError();
});

test("CREATE: should throw error after sending values in the wrong format", async () => {
    let testUser = [
        "test@gmail.com",
        "1",
        "test",
    ];
    expect(await ApiInstance.create('user', testUser)).toThrowError();
});

test("CREATE: should throw error after creating data for an non-existing field", async () => {
    let testUser = [
        "test@gmail.com",
        "wachtwoord123",
        "1",
        "test",
        "7",
    ];
    expect(await ApiInstance.create('animals', testUser)).toThrowError();
});



// //=============DELETE
test("DELETE: should delete data from the requested database", async () => {
    await ApiInstance.delete('user', 1);
    let db = await ApiInstance.read('user', 1);
    let deletedUser = db.content;
    let expectedObject = {};
    expect(deletedUser).toMatchObject(expectedObject);
});

test("DELETE: database server staat uit (UITVOEREN MET SERVER UIT)", async () => {
    expect(await ApiInstance.delete('user', 1)).toThrowError();
});

test("DELETE: database bevat niet de gespecificeerde table", async () => {
    expect(await ApiInstance.delete('animals', 1)).toThrowError();
});

test("DELETE: id parameter komt niet overeen met Id-field van de table entry", async () => {
    expect(await ApiInstance.delete('user', 33)).toThrowError();
});

test("DELETE: database bevat geen data", async () => {
        for (let index = 1; index <= 27; index++) {
            await ApiInstance.delete('user',index);
        };

        expect(await ApiInstance.delete('user', 1)).toThrowError();
});


// //================UPDATE
test("UPDATE: should update data in the requested database", async () => {
    let testUpdateUser = {
                Company_Id: 10,
                Email: "updated@gmail.com",
                Id: 1,
                Name: "updatedName",
                Password: "updated",
                Role_Id: 8,
        }
    await ApiInstance.update('user', 1, [
        "updated@gmail.com",
        "updated",
        "8",
        "updatedName",
        "10",
    ]);
    let db = await ApiInstance.read('user',1);
    let user = db.content[0];
    expect(user).toEqual(testUpdateUser);
});

test("UPDATE: database bevat niet de gespecificeerde table", async () => {
    let testUpdateUser = [
        "updated@gmail.com",
        "updated",
        "8",
        "updatedName",
        "10",
    ];
    expect(await ApiInstance.update('animals', 1, testUpdateUser)).toThrowError();
});

test("UPDATE: id parameter komt niet overeen met Id-field van de table entry", async () => {
    let testUpdateUser = [
        "updated@gmail.com",
        "updated",
        "8",
        "updatedName",
        "10",
    ];
    expect(await ApiInstance.update('user', 40, testUpdateUser)).toThrowError();
});

test("UPDATE: values parameter geeft de verkeerde table structuur mee", async () => {
    let testUpdateUser = [
        "updated@gmail.com",
        "updated",
        "8",
    ];
    expect(await ApiInstance.update('user', 1, testUpdateUser)).toThrowError();
});

test("UPDATE: database server staat uit (UITVOEREN MET SERVER UIT)", async () => {
    let testUpdateUser = [
        "updated@gmail.com",
        "updated",
        "8",
        "updatedName",
        "10",
    ];
    expect(await ApiInstance.update('user', 1, testUpdateUser)).toThrowError();
});

test("UPDATE: database bevat geen data", async () => {
        for (let index = 1; index <= 27; index++) {
            await ApiInstance.delete('user',index);
        };

        let testUpdateUser = [
            "updated@gmail.com",
            "updated",
            "8",
            "updatedName",
            "10",
        ];

        expect(await ApiInstance.update('user', 1, testUpdateUser)).toThrowError();
});

