import * as adminPortal from './admin-portal';
import Api from '../../helpers/Api';

const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibmFhbSI6IkFtYWRldXMgTW96YXJ0IiwiY29tcGFueSI6LTEsInR5cGUiOiJBZG1pbiJ9.NhqAZBmSlwQYj3BlefmcrEBFE5Dd6jfP0T5TFFXDwT0"
const ApiInstance = new Api(token);

beforeEach(() => {
    fetchMock.resetMocks();
});

const mockTemplates = JSON.stringify({
    Filepath: "\\storage\\1\\templates\\template1_com1.html",
    Id: 1,
    Name: "template1_com1"
});

const mockUser = JSON.stringify({
            Company_Id: 7,
            Email: "test@gmail.com",
            Id: 28,
            Name: "test",
            Password: "wachtwoord123",
            Role_Id: 1,
});

const mockDesigns = JSON.stringify({
    Created_at: "Sun Jan 10 2021 00:00:00 GMT+0100",
    Downloads: 10,
    Filepath: "\\storage\\1\\designs\\1\\design2_template1_0.html",
    Id: 2,
    Name: "design2_template1",
    Template_id: 1,
    Updated_at: "Fri Jun 11 2021 00:00:00 GMT+0200",
    Verified: true,
});

async function getData() {
    let portalArray = [];

    let companyListDb = await ApiInstance.all('company');

    fetchMock.mockResponseOnce(mockUser);
    let userListDb = await ApiInstance.all('user');

    fetchMock.mockResponseOnce(mockTemplates);
    let templateListDb = await ApiInstance.all('template');

    fetchMock.mockResponseOnce(mockDesigns);
    let designListDb = await ApiInstance.all('design');
    
    let temp = {
        DbId: 1,
        companyName: "Google",
        designList: designListDb,
        importedTemplateList: templateListDb,
        mainUserList: userListDb,
        portalId: 0,
    }
        portalArray.push(temp);
        return portalArray;
}

describe('Adminportal tests', () => {
    //=========getData
    test("getData: database server is aan, bevat data en bevat de gespecificeerde table", async () => {
        let expectedData = {
            DbId: 1,
            companyName: "Google",
            designList: {
                Created_at: "Sun Jan 10 2021 00:00:00 GMT+0100",
                Downloads: 10,
                Filepath: "\\storage\\1\\designs\\1\\design2_template1_0.html",
                Id: 2,
                Name: "design2_template1",
                Template_id: 1,
                Updated_at: "Fri Jun 11 2021 00:00:00 GMT+0200",
                Verified: true,
            },
            importedTemplateList: {
                Filepath: "\\storage\\1\\templates\\template1_com1.html",
                Id: 1,
                Name: "template1_com1"
            },
            mainUserList: {
                Company_Id: 7,
                Email: "test@gmail.com",
                Id: 28,
                Name: "test",
                Password: "wachtwoord123",
                Role_Id: 1,
            },
            portalId: 0
        };

        let db = await getData();
        expect(db[0]).toEqual(expectedData);
    });
})

