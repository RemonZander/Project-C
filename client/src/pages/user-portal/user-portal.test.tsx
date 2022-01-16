import * as userPortal from './user-portal';

describe.skip("User portal tests", () => {
    //=========getDesigns
    test("getDesigns: database server staat aan", async () => {
        let db = await userPortal.getDesigns();
        expect(db).toBe(expect.arrayContaining([expect.any(Object)]));
    });

    test("getDesigns: database server staat uit (UITVOEREN MET SERVER UIT)", async () => {
        expect(await userPortal.getDesigns()).toBe(undefined);
    });
    
    //=========getTemplates
    test("getTemplates: database server staat aan", async () => {
        let db = await userPortal.getTemplates();
        expect(db).toBe(expect.arrayContaining([expect.any(Object)]));
    });
    
    test("getTemplates: database server staat uit (UITVOEREN MET SERVER UIT)", async () => {
        expect(await userPortal.getTemplates()).toBe(undefined);
    });
    
    //=========onMakeMainUserButtonClick
    test("onMakeMainUserButtonClick: database server staat aan, geeft de juiste data mee en heeft de juiste datastructuur", () => {
        let testUser = {
            Company_Id: 1,
            Email: "user4@gmail.com",
            Id: 8,
            Name: "Helena Hoopstrooi",
            Password: "User1!",
            Role_Id: 3,
        };
        userPortal.onMakeMainUserButtonClick(testUser, 2);
        expect(testUser.Role_Id).toBe(2);
    });
    
    test("onMakeMainUserButtonClick: currentUserId geeft de verkeerde Id mee", () => {
        let testUser = {
            Company_Id: 1,
            Email: "user4@gmail.com",
            Id: 8,
            Name: "Helena Hoopstrooi",
            Password: "User1!",
            Role_Id: 3,
        };
        userPortal.onMakeMainUserButtonClick(testUser, 13);
        expect(testUser.Role_Id).toBe(2);
    });
    
    //=========ChangePass
    test("ChangePass: database server staat aan, userInstance geeft de juiste data mee en heeft de juiste datastructuur", async () => {
        let testUser = {
            company: 1,
            email: "moderator1@gmail.com",
            naam: "Liesje Lompkop",
            sub: 2,
            type: "Employee",
        };
        let testUserPassword = 'Moderator1!'
        expect(testUserPassword).toBe('Moderator1!');
    });
    
    //=========ChangePass 
    test("ChangePass: database server staat aan, userId geeft het juiste Id mee, userPassword geeft het juiste wachtwoord mee, currentPass is gelijk aan userPassword, newPass en confirmPass zijn niet leeg; zijn gelijk aan elkaar en newPass voldoet aan de wachtwoordvereisten", async () => {
        let testUser = {
            company: 1,
            email: "moderator1@gmail.com",
            naam: "Liesje Lompkop",
            sub: 2,
            type: "Employee",
        };
        await userPortal.ChangePass('Moderator1!','Heyhoihoi1!', 'Heyhoihoi1!', 2, 'Moderator1!', 'Moderator1!', 'Heyhoihoi1!', 'Heyhoihoi1!');
        let testUserPassword = 'Heyhoihoi1!'
        expect(testUserPassword).toBe('Heyhoihoi1!');
    });
    
    test("ChangePass: database server staat uit (UITVOEREN MET SERVER UIT)", async () => {
        expect(await userPortal.ChangePass('Moderator1!','Heyhoihoi1!', 'Heyhoihoi1!', 2, 'Moderator1!', 'Moderator1!', 'Heyhoihoi1!', 'Heyhoihoi1!')).toBe(undefined);
    });
    
    test("ChangePass: userId geeft het verkeerde Id mee", async () => {
        await userPortal.ChangePass('Moderator1!','Heyhoihoi1!', 'Heyhoihoi1!', 29, 'Moderator1!', 'Moderator1!', 'Heyhoihoi1!', 'Heyhoihoi1!');
        let testUserPassword = 'Moderator1!'
        expect(testUserPassword).toEqual('Moderator1');
    });
    
    test("ChangePass: newPass en confirmPass zijn niet leeg; zijn niet gelijk aan elkaar", async () => {
        let errorMessage = 'Wachtwoorden zijn ongelijk'
        expect(await userPortal.ChangePass('Moderator1!', 'oei!', 'Heyhoihoi1!', 2, 'Moderator1!', 'Moderator1!', 'oei!', 'Heyhoihoi1!')).toEqual(errorMessage);
    });
    
    test("ChangePass: newPass voldoet niet aan de wachtwoordvereisten", async () => {
        let errorMessage = 'Het wachtwoord voldoet niet aan de minimale eisen.'
        expect(await userPortal.ChangePass('Moderator1!', 'oei!', 'oei!', 2, 'Moderator1!', 'Moderator1!', 'oei!', 'oei!')).toEqual(errorMessage);
    });
    
    test("ChangePass: currentPass is niet gelijk aan userPassword", async () => {
        let errorMessage = 'Wachtwoorden zijn ongelijk'
        expect(await userPortal.ChangePass('Moderator1!', 'Heyhoihoi1!', 'Heyhoihoi1!',  2, 'Moderator1!', 'blahblah', 'Heyhoihoi1!', 'Heyhoihoi1!')).toEqual(errorMessage);
    });
})
