import Api from './Api';

const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibmFhbSI6IkFtYWRldXMgTW96YXJ0IiwiY29tcGFueSI6LTEsInR5cGUiOiJBZG1pbiJ9.NhqAZBmSlwQYj3BlefmcrEBFE5Dd6jfP0T5TFFXDwT0"
const ApiInstance = new Api(token);

beforeEach(() => {
    fetchMock.resetMocks();
});

const mockUser = JSON.stringify({
    content: [
        {
            Company_Id: -1,
            Email: "admin@gmail.com",
            Id: 1,
            Name: "Amadeus Mozart",
            Password: "Admin1!",
            Role_Id: 1,
        }
    ]
});

const mockCreateUser = JSON.stringify({
    content: [
        {
            Company_Id: 7,
            Email: "test@gmail.com",
            Id: 28,
            Name: "test",
            Password: "wachtwoord123",
            Role_Id: 1,
        }
    ]   
});

const mockDeleteUser = JSON.stringify({
    content: [
        {}
    ]   
});

const mockUpdatedUser = JSON.stringify({
    content: [
        {
            Company_Id: 10,
            Email: "updated@gmail.com",
            Id: 1,
            Name: "updatedName",
            Password: "updated",
            Role_Id: 8,
        }
    ]
});
//==============ALL
describe("Api helper tests", () => {
    test("ALL: database server staat aan en bevat relevante data in juiste format", async () => {
        // Arrange
        fetchMock.mockResponseOnce(mockUser);

        // Act
        let users = await ApiInstance.all('user');

        // Assert
        expect(users).toBeInstanceOf(Object);
    });
    
    test("ALL: database server staat uit", async () => {
        //Act
        let users = await ApiInstance.all('user');

        // Assert
        expect(users).toBe(undefined);
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
        }
        fetchMock.mockResponseOnce(mockUser);

        let user = await ApiInstance.read('user', 1);

        expect(user.content[0]).toEqual(testUser);
    });
    
    test.skip("READ: database server staat uit (UITVOEREN MET SERVER UIT)", async () => {
        //Act
        let users = await ApiInstance.read('user',1);

        //Assert
        expect(users).toBe(undefined);
    });
    
    test("READ: should throw error after giving a non-existent field as parameter for read", async () => {
        let users = await ApiInstance.read('animals',1);

        expect(users).toBe(undefined);
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
            
        fetchMock.mockResponseOnce(mockCreateUser);
        let user = await ApiInstance.read('user', 28);
    
        expect(user.content[0]).toEqual(testUser);
    });
    
    test.skip("CREATE: database server staat uit (UITVOEREN MET SERVER UIT)", async () => {
        let testUser = [
            "test@gmail.com",
            "wachtwoord123",
            "1",
            "test",
            "7",
        ];

        await ApiInstance.create('user', testUser);
        let user = await ApiInstance.read('user', 28);

        expect(user).toBe(undefined);
    });
    
    test("CREATE: should throw error after sending values in the wrong format", async () => {
        let testUser = [
            "test@gmail.com",
            "1",
            "test",
        ];

        await ApiInstance.create('user', testUser);
        let user = await ApiInstance.read('user', 28);

        expect(user).toBe(undefined);
    });
    
    test("CREATE: should throw error after creating data for an non-existing field", async () => {
        let testUser = [
            "test@gmail.com",
            "wachtwoord123",
            "1",
            "test",
            "7",
        ];

        await ApiInstance.create('animals', testUser);
        let user = await ApiInstance.read('animals', 1);

        expect(user).toBe(undefined);
    });
    
//=============DELETE
    test("DELETE: should delete data from the requested database", async () => {
        await ApiInstance.delete('user', 1);

        fetchMock.mockResponseOnce(mockDeleteUser);

        let db = await ApiInstance.read('user', 1);
        let expectedObject = {};

        expect(db).toMatchObject(expectedObject);
    });
    
    test.skip("DELETE: database server staat uit (UITVOEREN MET SERVER UIT)", async () => {
        await ApiInstance.delete('user', 1);

        let db = await ApiInstance.read('user', 1);

        expect(db).toBe(undefined);
    });
    
    test("DELETE: database bevat niet de gespecificeerde table", async () => {
        await ApiInstance.delete('animals',1);
        let db = await ApiInstance.read('animals',1);

        expect(db).toBe(undefined);
    });
    
    test("DELETE: id parameter komt niet overeen met Id-field van de table entry", async () => {
        await ApiInstance.delete('user',103);
        let db = await ApiInstance.read('user',103);

        expect(db).toBe(undefined);
    });
    
//================UPDATE
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

        fetchMock.mockResponseOnce(mockUpdatedUser);

        let user = await ApiInstance.read('user',1);

        expect(user.content[0]).toEqual(testUpdateUser);
    });
    
    test("UPDATE: database bevat niet de gespecificeerde table", async () => {
        let testUpdateUser = [
            "updated@gmail.com",
            "updated",
            "8",
            "updatedName",
            "10",
        ];

        await ApiInstance.update('animals', 1, testUpdateUser)
        let user = await ApiInstance.read('animals',1);

        expect(user).toBe(undefined)
    });
    
    test("UPDATE: id parameter komt niet overeen met Id-field van de table entry", async () => {
        let testUpdateUser = [
            "updated@gmail.com",
            "updated",
            "8",
            "updatedName",
            "10",
        ];
        await ApiInstance.update('user', 40, testUpdateUser)
        let user = await ApiInstance.read('user',40);

        expect(user).toBe(undefined);
    });
    
    test("UPDATE: values parameter geeft de verkeerde table structuur mee", async () => {
        let testUpdateUser = [
            "updated@gmail.com",
            "updated",
            "8",
        ];

        await ApiInstance.update('user', 1, testUpdateUser);
        fetchMock.mockResponseOnce(mockCreateUser);
        let user = await ApiInstance.read('user', 1);

        expect(user.content[0]).toEqual(testUpdateUser);
    });
    
    test.skip("UPDATE: database server staat uit (UITVOEREN MET SERVER UIT)", async () => {
        let testUpdateUser = [
            "updated@gmail.com",
            "updated",
            "8",
            "updatedName",
            "10",
        ];
        await ApiInstance.update('user', 1, testUpdateUser)
        let user = await ApiInstance.read('user',1);

        expect(user).toBe(undefined);
    });
})

