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

const mockDesgins = JSON.stringify({
    Created_at: "Sun Jan 10 2021 00:00:00 GMT+0100",
    Downloads: 10,
    Filepath: "\\storage\\1\\designs\\1\\design2_template1_0.html",
    Id: 2,
    Name: "design2_template1",
    Template_id: 1,
    Updated_at: "Fri Jun 11 2021 00:00:00 GMT+0200",
    Verified: true,
});

async function getTemplates() {
    fetchMock.mockResponseOnce(mockTemplates);
    let templates = await ApiInstance.all('template');
    return templates;
}

async function getDesigns() {
    fetchMock.mockResponseOnce(mockDesgins);
    let designListDb = await ApiInstance.all('design');

    fetchMock.mockResponseOnce(mockTemplates);
    let templateListDb = await ApiInstance.all('template');

    return designListDb;
}

function ChangePass(setCurrentPassInput: any, currentPass: string, newPass: string, confirmPass: string) {
        if (currentPass === '') {
            return 'Dit veld is verplicht';
        }    
        else {
            if (setCurrentPassInput !== currentPass) {
                return 'Het wachtwoord is onjuist';
            }
        }
        if (newPass === '') {
            return 'Dit veld is verplicht';
        }
        if (confirmPass === '') {
            return 'Dit veld is verplicht';
        }
        if (newPass !== confirmPass) {
            return 'Wachtwoorden zijn ongelijk';
        }

    // check for password format; minimaal 8 tekens, 1+ hoofdletter, 1+ cijfer & 1+ speciaal teken
    if (['!', '@', '#', '$', '%', '^', '&', ' *', '(', ')', '-', '_', '=', '+', '[', ']', '{', '}', `|`, ';', ':', "'", '"', ',', '<', '.', '>', '/', '?', '`', '~'].some(s => newPass.includes(s)) &&
        ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].some(s => newPass.includes(s)) && newPass.length > 7 &&
        ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'].some(s => newPass.includes(s)) &&
        ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'].some(s => newPass.includes(s.toUpperCase()))) {
            return newPass;        
        }
    else {
        return 'Het wachtwoord voldoet niet aan de minimale eisen';
    }
}

describe("User portal tests", () => {
    //=========getDesigns
    test("getDesigns: database server staat aan", async () => {
        let expectedDesign = {
            Created_at: "Sun Jan 10 2021 00:00:00 GMT+0100",
            Downloads: 10,
            Filepath: "\\storage\\1\\designs\\1\\design2_template1_0.html",
            Id: 2,
            Name: "design2_template1",
            Template_id: 1,
            Updated_at: "Fri Jun 11 2021 00:00:00 GMT+0200",
            Verified: true,
        }

        let db = await getDesigns();

        expect(db).toEqual(expectedDesign);
    });
    
    //=========getTemplates
    test("getTemplates: database server staat aan", async () => {
        let expectedTemplate = {
            Filepath: "\\storage\\1\\templates\\template1_com1.html",
            Id: 1,
            Name: "template1_com1"
        }

        let db = await getTemplates();
    
        expect(db).toEqual(expectedTemplate);
    });
    
    //=========ChangePass 
    test("ChangePass: database server staat aan, userId geeft het juiste Id mee, userPassword geeft het juiste wachtwoord mee, currentPass is gelijk aan userPassword, newPass en confirmPass zijn niet leeg; zijn gelijk aan elkaar en newPass voldoet aan de wachtwoordvereisten", () => {
        let newWachtwoord = ChangePass('Moderator1!', 'Moderator1!', 'Heyhoihoi1!', 'Heyhoihoi1!');
        expect(newWachtwoord).toBe('Heyhoihoi1!');
    });
    
    test("ChangePass: newPass en confirmPass zijn niet leeg; zijn niet gelijk aan elkaar", () => {
        let errorMessage = ChangePass('Moderator1!','Moderator1!', 'Moderator1!', 'oei!')
        expect(errorMessage).toEqual('Wachtwoorden zijn ongelijk');
    });
    
    test("ChangePass: newPass voldoet niet aan de wachtwoordvereisten", () => {
        let errorMessage = 'Het wachtwoord voldoet niet aan de minimale eisen'
        expect(ChangePass('Moderator1!', 'Moderator1!', 'oei!', 'oei!')).toEqual(errorMessage);
    });
    
    test("ChangePass: currentPass is niet gelijk aan userPassword", () => {
        let errorMessage = 'Het wachtwoord is onjuist'
        expect(ChangePass('blahblah', 'Moderator1!', 'Heyhoihoi1!', 'Heyhoihoi1!')).toEqual(errorMessage);
    });
})
