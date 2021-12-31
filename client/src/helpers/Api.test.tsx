import Api from './Api';

const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibmFhbSI6IkFtYWRldXMgTW96YXJ0IiwiY29tcGFueSI6LTEsInR5cGUiOiJBZG1pbiJ9.NhqAZBmSlwQYj3BlefmcrEBFE5Dd6jfP0T5TFFXDwT0"
const ApiInstance = new Api(token);
//==============ALL
test("ALL: database server staat aan en bevat relevante data in juiste format", () => {
    (async () => {
        expect(ApiInstance.all('user')).toBe(
            expect.objectContaining(
                expect.arrayContaining([expect.any(Object)])
            )
        );
    })
});

test("ALL: database server staat uit (UITVOEREN MET SERVER UIT)", () => {
    (async () => {
        expect(ApiInstance.all('user')).toThrowError();
    })
});

test("ALL: database bevat geen data", () => {
    (async () => {
        for (let index = 1; index <= 7; index++) {
            ApiInstance.delete('user',index);
        };

        const db = await ApiInstance.all('user');
        const realArray = db.content;
        expect(realArray).toHaveLength(0);
    })
});

//==============READ
test("READ: should read data from the requested database", () => {
    let testUser = {
        Company_Id: -1,
        Email: "admin@gmail.com",
        Id: 1,
        Name: "Amadeus Mozart",
        Password: "Admin1!",
        Role_Id: 1,
    };
    expect(ApiInstance.read('user', 1)).toEqual(
        expect.objectContaining(
            expect.arrayContaining([testUser])
        )
    );
});

test("READ: database server staat uit (UITVOEREN MET SERVER UIT)", () => {
    expect(ApiInstance.read('user', 1)).toThrowError();
});

test("READ: database bevat geen data", () => {
    (async () => {
        for (let index = 1; index <= 7; index++) {
            ApiInstance.delete('user',index);
        };

        expect(ApiInstance.read('user', 1)).toThrowError();
    })
});

test("READ: should throw error after giving a non-existent field as parameter for read", () => {
    expect(ApiInstance.read('animals', 1)).toThrowError();
});

//============CREATE
test("CREATE: should create data for the requested database", () => {
    let testUser = [
        "test@gmail.com",
        "wachtwoord123",
        1,
        "test",
        7,
    ];
    ApiInstance.create('user', testUser);

    expect(ApiInstance.read('user', 7)).toEqual(
        expect.objectContaining(
            expect.arrayContaining([testUser])
        )
    );
});

test("CREATE: database server staat uit (UITVOEREN MET SERVER UIT)", () => {
    let testUser = [
        "test@gmail.com",
        "wachtwoord123",
        1,
        "test",
        7,
    ];
    expect(ApiInstance.create('user', testUser)).toThrowError();
});

test("CREATE: should throw error after sending values in the wrong format", () => {
    let testUser = [
        "test@gmail.com",
        1,
        "test",
    ];
    expect(ApiInstance.create('user', testUser)).toThrowError();
});

test("CREATE: should throw error after creating data with the wrong data-types", () => {
    let testUser = [
        "test@gmail.com",
        ["wachtwoord123"],
        1,
        "test",
        7,
    ];
    expect(ApiInstance.create('user', testUser)).toThrowError();
});

test("CREATE: should throw error after creating data for an non-existing field", () => {
    let testUser = [
        "test@gmail.com",
        "wachtwoord123",
        "1",
        "test",
        "7",
    ];
    expect(ApiInstance.create('animals', testUser)).toThrowError();
});



//=============DELETE
test("DELETE: should delete data from the requested database", () => {
    ApiInstance.delete('user', 1);
    expect(ApiInstance.read('user', 1)).toEqual(
        expect.objectContaining(
            typeof(Object)
        )
    );
});

test("DELETE: database server staat uit (UITVOEREN MET SERVER UIT)", () => {
    expect(ApiInstance.delete('user', 1)).toThrowError();
});

test("DELETE: database bevat niet de gespecificeerde table", () => {
    expect(ApiInstance.delete('animals', 1)).toThrowError();
});

test("DELETE: id parameter komt niet overeen met Id-field van de table entry", () => {
    expect(ApiInstance.delete('user', 20)).toThrowError();
});


test("DELETE: database bevat geen data", () => {
    (async () => {
        for (let index = 1; index <= 7; index++) {
            ApiInstance.delete('user',index);
        };

        expect(ApiInstance.delete('user', 1)).toThrowError();
    })
});



//================UPDATE
test("UPDATE: should update data in the requested database", () => {
    let testUpdateUser = [
        "updated@gmail.com",
        "updated",
        "8",
        "updatedName",
        "10",
    ];
    ApiInstance.update('user', 1, testUpdateUser);
    expect(ApiInstance.read('user', 1)).toEqual(
        expect.objectContaining(
            expect.arrayContaining([testUpdateUser])
        )
    );
});

test("UPDATE: database bevat niet de gespecificeerde table", () => {
    let testUpdateUser = [
        "updated@gmail.com",
        "updated",
        "8",
        "updatedName",
        "10",
    ];
    expect(ApiInstance.update('animals', 1, testUpdateUser)).toThrowError();
});

test("UPDATE: id parameter komt niet overeen met Id-field van de table entry", () => {
    let testUpdateUser = [
        "updated@gmail.com",
        "updated",
        8,
        "updatedName",
        "10",
    ];
    expect(ApiInstance.update('user', 10, testUpdateUser)).toThrowError();
});

test("UPDATE: values parameter bevat de verkeerde data", () => {
    let testUpdateUser = [
        "updated@gmail.com",
        ["updated"],
        "8",
        ["updatedName"],
        "10",
    ];
    expect(ApiInstance.update('user', 1, testUpdateUser)).toThrowError();
});

test("UPDATE: values parameter geeft de verkeerde table structuur mee", () => {
    let testUpdateUser = [
        "updated@gmail.com",
        "updated",
        "8",
    ];
    expect(ApiInstance.update('user', 1, testUpdateUser)).toThrowError();
});

test("UPDATE: database server staat uit (UITVOEREN MET SERVER UIT)", () => {
    let testUpdateUser = [
        "updated@gmail.com",
        "updated",
        "8",
        "updatedName",
        "10",
    ];
    expect(ApiInstance.update('user', 1, testUpdateUser)).toThrowError();
});

test("UPDATE: database bevat geen data", () => {
    (async () => {
        for (let index = 1; index <= 7; index++) {
            ApiInstance.delete('user',index);
        };

        let testUpdateUser = [
            "updated@gmail.com",
            "updated",
            "8",
            "updatedName",
            "10",
        ];

        expect(ApiInstance.update('user', 1, testUpdateUser)).toThrowError();
    })
});

