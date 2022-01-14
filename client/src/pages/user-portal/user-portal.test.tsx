import * as userPortal from './user-portal';

describe.skip("User portal tests", () => {
    //=========getDesigns
    test("getDesigns: database server staat aan", async () => {
        let db = await userPortal.getDesigns();
        expect(db).toBe(expect.arrayContaining([expect.any(Object)]));
    });

    // test("getDesigns: database server staat uit (UITVOEREN MET SERVER UIT)", async () => {
    //     expect(await userPortal.getDesigns()).toThrowError();
    // });
    
    // //=========getTemplates
    // test("getTemplates: database server staat aan", async () => {
    //     let db = await userPortal.getTemplates();
    //     expect(db).toBe(expect.arrayContaining([expect.any(Object)]));
    // });
    
    // test("getTemplates: database server staat uit (UITVOEREN MET SERVER UIT)", async () => {
    //     expect(await userPortal.getTemplates()).toThrowError();
    // });
    
    // //=========onMakeMainUserButtonClick
    // test("onMakeMainUserButtonClick: database server staat aan, geeft de juiste data mee en heeft de juiste datastructuur", () => {
    //     let testUser = {
    //         Company_Id: 1,
    //         Email: "user4@gmail.com",
    //         Id: 8,
    //         Name: "Helena Hoopstrooi",
    //         Password: "User1!",
    //         Role_Id: 3,
    //     };
    //     userPortal.onMakeMainUserButtonClick(testUser, 2);
    //     expect(testUser.Role_Id).toBe(2);
    // });
    
    // test("onMakeMainUserButtonClick: currentUserId geeft de verkeerde Id mee", () => {
    //     let testUser = {
    //         Company_Id: 1,
    //         Email: "user4@gmail.com",
    //         Id: 8,
    //         Name: "Helena Hoopstrooi",
    //         Password: "User1!",
    //         Role_Id: 3,
    //     };
    //     userPortal.onMakeMainUserButtonClick(testUser, 13);
    //     expect(testUser.Role_Id).toBe(2);
    // });
    
    // //=========GetUserPassword
    // test("GetUserPassword: database server staat aan, userInstance geeft de juiste data mee en heeft de juiste datastructuur", async () => {
    //     let testUser = {
    //         company: 1,
    //         email: "moderator1@gmail.com",
    //         naam: "Liesje Lompkop",
    //         sub: 2,
    //         type: "Employee",
    //     };
    //     expect(await userPortal.GetUserPassword(testUser)).toBe('Moderator1!');
    // });
    
    // //=========ChangePass 
    // test("ChangePass: database server staat aan, userId geeft het juiste Id mee, userPassword geeft het juiste wachtwoord mee, currentPass is gelijk aan userPassword, newPass en confirmPass zijn niet leeg; zijn gelijk aan elkaar en newPass voldoet aan de wachtwoordvereisten", async () => {
    //     let testUser = {
    //         company: 1,
    //         email: "moderator1@gmail.com",
    //         naam: "Liesje Lompkop",
    //         sub: 2,
    //         type: "Employee",
    //     };
    //     await userPortal.ChangePass('Moderator1!','Heyhoihoi1!', 'Heyhoihoi1!', 2, 'Moderator1!', 'Moderator1!', 'Heyhoihoi1!', 'Heyhoihoi1!', "");
    //     expect(await userPortal.GetUserPassword(testUser)).toBe('Heyhoihoi1!');
    // });
    
    // test("ChangePass: database server staat uit (UITVOEREN MET SERVER UIT)", async () => {
    //     let testUser = {
    //         company: 1,
    //         email: "moderator1@gmail.com",
    //         naam: "Liesje Lompkop",
    //         sub: 2,
    //         type: "Employee",
    //     };
    //     await userPortal.ChangePass('Moderator1!','Heyhoihoi1!', 'Heyhoihoi1!', 2, 'Moderator1!', 'Moderator1!', 'Heyhoihoi1!', 'Heyhoihoi1!', "");
    //     expect(await userPortal.GetUserPassword(testUser)).toThrowError();
    // });
    
    // test("ChangePass: userId geeft het verkeerde Id mee", async () => {
    //     let testUser = {
    //         company: 1,
    //         email: "moderator1@gmail.com",
    //         naam: "Liesje Lompkop",
    //         sub: 2,
    //         type: "Employee",
    //     };
    //     await userPortal.ChangePass('Moderator1!','Heyhoihoi1!', 'Heyhoihoi1!', 29, 'Moderator1!', 'Moderator1!', 'Heyhoihoi1!', 'Heyhoihoi1!', "");
    //     expect(await userPortal.GetUserPassword(testUser)).toThrowError();
    // });
    
    // test("ChangePass: newPass en confirmPass zijn niet leeg; zijn niet gelijk aan elkaar", async () => {
    //     let testUser = {
    //         company: 1,
    //         email: "moderator1@gmail.com",
    //         naam: "Liesje Lompkop",
    //         sub: 2,
    //         type: "Employee",
    //     };
    //     await userPortal.ChangePass('Moderator1!', 'oei!', 'Heyhoihoi1!', 2, 'Moderator1!', 'Moderator1!', 'oei!', 'Heyhoihoi1!', "");
    //     expect(await userPortal.GetUserPassword(testUser)).toThrowError();
    // });
    
    // test("ChangePass: newPass voldoet niet aan de wachtwoordvereisten", async () => {
    //     let testUser = {
    //         company: 1,
    //         email: "moderator1@gmail.com",
    //         naam: "Liesje Lompkop",
    //         sub: 2,
    //         type: "Employee",
    //     };
    //     await userPortal.ChangePass('Moderator1!', 'oei!', 'oei!', 2, 'Moderator1!', 'Moderator1!', 'oei!', 'oei!', "");
    //     expect(await userPortal.GetUserPassword(testUser)).toThrowError();
    // });
    
    // test("ChangePass: currentPass is niet gelijk aan userPassword", async () => {
    //     let testUser = {
    //         company: 1,
    //         email: "moderator1@gmail.com",
    //         naam: "Liesje Lompkop",
    //         sub: 2,
    //         type: "Employee",
    //     };
    //     await userPortal.ChangePass('Moderator1!', 'Heyhoihoi1!', 'Heyhoihoi1!',  2, 'Moderator1!', 'blahblah', 'Heyhoihoi1!', 'Heyhoihoi1!', "");
    //     expect(await userPortal.GetUserPassword(testUser)).toThrowError();
    // });
})
