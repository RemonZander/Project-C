import * as adminPortal from './admin-portal';
import Api from '../../helpers/Api';

const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibmFhbSI6IkFtYWRldXMgTW96YXJ0IiwiY29tcGFueSI6LTEsInR5cGUiOiJBZG1pbiJ9.NhqAZBmSlwQYj3BlefmcrEBFE5Dd6jfP0T5TFFXDwT0"
const ApiInstance = new Api(token);

describe.skip('Adminportal tests', () => {
    //=========getData
    test("getData: database server is aan, bevat data en bevat de gespecificeerde table", async () => {
        let db = await adminPortal.getData();
        expect(db).toBe(expect.arrayContaining([expect.any(Object)]));
    });
    
    test("getData: database bevat geen data", async () => {
        for (let index = 1; index <= 3; index++) {
            await ApiInstance.delete('company',index);
        }
        for (let index = 1; index <= 27; index++) {
            await ApiInstance.delete('user',index);
        }
        for (let index = 1; index <= 8; index++) {
            await ApiInstance.delete('template',index);
        }
        for (let index = 1; index <= 12; index++) {
            await ApiInstance.delete('company',index);
        }
    
        expect(await adminPortal.getData()).toThrowError(); 
    });
})

