import * as React from 'react';
import './admin-portal.css';
import kyndaLetter from './kyndaletter.png';
import cog from './cog69420.png';
import FotoGalleryImg from './photolibicon.jpg';
import { CreateExport } from '../../helpers/Export';
import Api from '../../helpers/Api';
import { getToken } from '../../helpers/Token';
import Enumerable from 'linq';

async function getData() {
    const ApiInstance = new Api(getToken());

    // sets the arrays w data in them from the database
    let companyListDb = await ApiInstance.all('company');
    let companyList = Enumerable.from(companyListDb.content).toArray();
    let userListDb = await ApiInstance.all('user');
    let userList = Enumerable.from(userListDb.content).toArray();
    let templateListDb = await ApiInstance.all('template');
    var templateList = Enumerable.from(templateListDb.content).toArray();
    let designListDb = await ApiInstance.all('design');
    let designList = Enumerable.from(designListDb.content).toArray();

    const testArr = [];

    for (let listPos = 0; listPos < companyList.length; listPos++) {
        let id = 'selector ' + listPos;

        let templateListTemp = Enumerable.from(templateList)
            .where((t) => t.Company_id === companyList[listPos].Id)
            .toArray();

        // gets list of designs in user-portal
        const templateIdList = templateListTemp.map((i) => i.Id);

        let designListTemp = Enumerable.from(designList)
            .where((d) => templateIdList.includes(d.Template_id))
            .toArray();

        // finds user-portal admin
        let adminUser = Enumerable.from(userList)
            .where((a) => a.Company_Id === companyList[listPos].Id && a.Role_Id === 2)
            .toArray()[0];

        let userListTemp = Enumerable.from(userList)
            .where((u) => u.Company_Id === companyList[listPos].Id && u.Role_Id === 1)
            .toArray();

        // makes new user-portal w cool new data
        let temp = new UserPortalData(
            listPos,
            (
                <div class="userPortalItemBox">
                    <div class="userPortalItem">
                        <div class="userPortalItemName">
                            {'User Portal ' + (userPortalList.length + 1)} {/* also get from db */}{' '}
                            <br />
                        </div>
                        <div class="userPortalItemCompany" id={'userPortalItemCompany' + id}>
                            {companyList[listPos].Name} {/* get this from db */}
                        </div>
                        <div class="selectUserPortalButton" id={id} onClick={() => SelectUser(id)}>
                            Selecteren
                        </div>
                    </div>
                </div>
            ),
            companyList[listPos].Name,
            adminUser,
            userListTemp,
            templateListTemp,
            designListTemp
        );

        testArr.push(temp);
        // userPortalDivList.push(temp.portalListDivs);
        // userPortalList.push(temp);
        // console.log(temp);
    }

    return testArr;
}

class UserPortalData {
    constructor(id, divs, companyName, mainUser, employeeList, templateList, designList) {
        this.portalId = id;
        this.portalListDivs = divs; // are the divs that appear in the userportal list on the side
        this.companyName = companyName; // get from database
        this.mainUserList = mainUser;
        this.registeredEmployeeList = employeeList; //get from database; is {id: id, name: name}
        this.importedTemplateList = templateList;
        this.designList = designList;
    }
}

let userPortalDivList = []; // array for divs
let userPortalList = []; // array of UserPortalData objects

function AdminPortal() {
    const [userPortalList1, SetUserPortalList] = React.useState([]);
    const [data, setData] = React.useState([]);

    const dataElements = [];

    React.useEffect(() => {
        (async () => {
            const temp = await getData();

            setData(temp);
        })();
    }, []);

    return (
        <div>
            {/* menubar bijna tzelfde als die in user-portal.js */}
            <div class="menuBarAdmin">
                <div class="kyndaLogo">
                    <img src={kyndaLetter} width="104" height="55" alt="kyndaLogoImg" />
                </div>
                <div class="adminPortalHeader">Adminportaal</div>
                <div class="dropDown">
                    <label for="menu"> Opties: </label>
                    <select name="menu" id="menu">
                        <option value="optie1">optie1</option>
                        <option value="optie2">optie2</option>
                        <option value="optie3">optie3</option>
                        <option value="optie4">optie4</option>
                    </select>
                </div>
                <div class="logOutButton">
                    <div className="logUitButton">Uitloggen</div>
                </div>
                <div class="kyndaCog">
                    <img src={cog} width="40" height="40" alt="settingsImg" />
                </div>
            </div>

            <div class="mainPage">
                <div class="userPortals">
                    <div class="listViewTxtBox">
                        <p class="listViewTxt">User Portals</p>
                    </div>
                    <div class="userPortalList" id="userPortalList">
                        {data.map((data) => {
                            return (
                                <div class="userPortalItemBox">
                                    <div class="userPortalItem">
                                        <div class="userPortalItemName">
                                            {'User Portal ' + (data.portalId + 1)}
                                            <br />
                                        </div>
                                        <div
                                            class="userPortalItemCompany"
                                            id={
                                                'userPortalItemCompany' +
                                                'selector ' +
                                                data.portalId
                                            }
                                        >
                                            {data.companyName}
                                        </div>
                                        <div
                                            class="selectUserPortalButton"
                                            id={'selector ' + data.portalId}
                                            onClick={() => SelectUser('selector ' + data.portalId)}
                                        >
                                            Selecteren
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div
                        class="addUserPortalButton"
                        onClick={() => SetUserPortalList(userPortalDivList.push(AddUserPortal()))}
                    >
                        User Portal Toevoegen
                    </div>
                </div>
                <div class="mainView" id="mainView">
                    <div class="mainViewTop">
                        <div className="MainViewHeader">
                            <div class="mainViewHeaderText" id="mainViewHeaderText"></div>
                            <div class="mainViewUser" id="mainViewUser">
                                <div class="mainViewUserHeader" id="mainViewUserHeader">
                                    Hoofdgebruiker
                                </div>
                                <div class="mainViewUserData" id="mainViewUserData"></div>
                            </div>
                        </div>
                        <img className="FotoGalleryButton" src={FotoGalleryImg} alt="gallery" />
                        <div className="DoubleButtons">
                            <div
                                className="ImportTemplateButton"
                                onClick={function () {
                                    window.open('/template-engine', '_blank').focus();
                                }}
                            >
                                <h3>Import template</h3>
                            </div>
                            <div className="GebruikerToevoegen" onClick={() => GbrToevoegen()}>
                                <h3>Gebruiker toevoegen</h3>
                            </div>
                        </div>
                        <div className="DoubleButtons">
                            <div className="HoofdgebruikerWijzigen">
                                <h3>Hoofdgebruiker account wijzigen</h3>
                            </div>
                            <div className="BedrijfnaamWijzigen" id="BedrijfnaamWijzigen">
                                <h3>Bedrijfnaam wijzigen</h3>
                            </div>
                        </div>
                        <div className="DeletePortal" id="DeletePortal">
                            <h3>Delete user-portal</h3>
                            <div className="DeletePortalTxt" id="DeletePortalTxt">
                                Bevestig uw keuze
                            </div>
                            <div className="DeletePortalConfirm" id="DeletePortalConfirm">
                                Verwijderen
                            </div>
                        </div>
                    </div>
                    <div className="MainViewBottom">
                        <div class="mainViewUserList">
                            <div className="mainViewUserDataHeader">Geregistreerde gebruikers</div>
                            <div class="mainViewUserDataList" id="mainViewUserDataList"></div>
                        </div>
                        <div class="mainViewTemplates">
                            <div class="mainViewTemplatesHeader">Templates</div>
                            <div class="mainViewTemplatesList" id="mainViewTemplatesList"></div>
                        </div>
                        <div class="mainViewTemplatePreview" id="mainViewTemplatePreview"></div>
                        <div className="Gbrtoevoegen" id="Gbrtoevoegen">
                            <div className="GbrToevoegenHeader">Gebruiker toevoegen</div>
                            <div className="GbrInvoer">
                                Naam: <input type="text" id="GbrNaamInvoer" />
                            </div>
                            <div className="GbrInvoer">
                                Email: <input type="text" id="GbrEmailInvoer" />
                            </div>
                            <div className="GbrInvoer">
                                Wachtwoord: <input type="text" id="GbrPassInvoer" />
                            </div>
                            <div className="GbrToevoegenbutton" id="GbrToevoegenbutton">
                                Gebruiker toevoegen
                            </div>
                        </div>
                        <div class="mainViewDesigns" id="mainViewDesigns">
                            <div class="mainViewDesignsHeader">Designs</div>
                            <div class="mainViewDesignsList" id="mainViewDesignsList"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/*function DrawUserPortals() {
    // function to generate user-portal list-view

    for (let listPos = 1; listPos <= userPortalAmount; listPos++) {
        let id = 'selector ' + listPos;
        let temp = new UserPortalData(
            listPos,
            (
                <div class="userPortalItemBox">
                    <div class="userPortalItem">
                        <div class="userPortalItemName">
                            {'User Portal ' + (userPortalList.length + 1)} {*/ /* also get from db */ /*} <br />
                        </div>
                        <div class="userPortalItemCompany" id={'userPortalItemCompany' + id}>
                            {'S.T.D. Wines & Liquors inc.' } {*/ /* get this from db */ /*}
                        </div>
                        <div class="selectUserPortalButton" id={id} onClick={() => SelectUser(id)}>
                            Selecteren
                        </div>
                    </div>
                </div>
            ),
            employeedata()
        );
        userPortalDivList.push(temp.portalListDivs);
        userPortalList.push(temp);
    }
}

function employeedata() {
    const names = [
        'Henkje Geisterbrei',
        'Sinter Klaas',
        'Sietske Haarbal',
        'Saskia Krentenbol',
        'La Llrona',
        'Brammetje Bakvet',
        'Pauline Pisnicht',
        'Merel Maagzuur',
    ]; // is temp
    let employeedatatemp = [];
    for (var a = 0; a < names.length; a++) {
        let employeedata = new EmployeeData(a, names[a]);
        employeedatatemp.push(employeedata);
    }

    return employeedatatemp;
}
*/
function SelectUser(id) {
    const pos = id.replace('selector ', '');
    document.getElementById('mainView').style.display = 'flex';

    // unloads any menu's from a previously selected user-portal
    document.getElementById('mainViewTemplatePreview').style.display = 'none';
    document.getElementById('mainViewDesigns').style.display = 'none';
    document.getElementById('DeletePortalTxt').style.display = 'none';
    document.getElementById('DeletePortalConfirm').style.display = 'none';

    // sets relevant data for header (portal id, company name)
    document.getElementById('mainViewHeaderText').innerHTML =
        `<h1>User Portal ` +
        userPortalList[pos - 1].portalId +
        `</h1>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<p class="CompanyName">` +
        document.getElementById('userPortalItemCompanyselector ' + pos).innerHTML +
        `</p>`;

    // sets relevant data for main user display (id, name, e-mail)
    document.getElementById('mainViewUserData').innerHTML =
        `<p class="mainViewUserDataText">ID: ` +
        userPortalList[pos - 1].mainUserList.id +
        `<br/>` +
        'Naam: ' +
        userPortalList[pos - 1].mainUserList.name +
        `<br/>` +
        'E-mail: ' +
        userPortalList[pos - 1].mainUserList.contact +
        `</p>`;

    // sets relevant data for users in portal
    document.getElementById('mainViewUserDataList').innerHTML = '';
    document.getElementById('mainViewUserDataList').appendChild(FillUserDataList(pos - 1));

    // sets relevant data for download stats
    document.getElementById('mainViewTemplatesList').innerHTML = '';
    document.getElementById('mainViewTemplatesList').appendChild(FillTemplateList(pos - 1));

    // adds onclick to bedrijfnaam wijzigen & delete user-portal buttons
    document.getElementById('BedrijfnaamWijzigen').onclick = function () {
        ChangeCompanyName(pos);
    };
    document.getElementById('DeletePortal').onclick = function () {
        DeleteUserPortalStep(pos, false);
    };
    document.getElementById('DeletePortalConfirm').onclick = function () {
        DeleteUserPortalStep(pos, true);
    };

    // continue making selection screen
    /* verhouding a4:
        element.style.width = '459px'; 
        element.style.height = '650px';
        1 : 1.416
    */
}

function AddUserPortal() {}
/*function AddUserPortal() {
    // gives functionality to "User Portal Toevoegen" button; ID incrementally increases by 1
    let id = 'selector ' + (userPortalList.length + 1);
    const names = [
        'Henkje Geisterbrei',
        'Sinter Klaas',
        'Sietske Haarbal',
        'Saskia Krentenbol',
        'La Llrona',
        'Brammetje Bakvet',
        'Pauline Pisnicht',
        'Merel Maagzuur',
    ]; also temp
    let employeedatatemp = [];
   for (var a = 0; a < names.length; a++) {
        let employeedata = new EmployeeData(a, names[a]);
        employeedatatemp.push(employeedata);
    }
    let temp = new UserPortalData(
        userPortalList.length + 1,
        (
            <div class="userPortalItemBox">
                <div class="userPortalItem">
                    <div class="userPortalItemName">
                        {'User Portal ' + (userPortalList.length + 1)} {/* get from db */ /* <br />
                    </div>
                    <div class="userPortalItemCompany" id={'userPortalItemCompany' + id}>
                        {'S.T.D. Wines & Liquors inc.'} {/* get from db */ /*
                    </div>
                    <div class="selectUserPortalButton" id={id} onClick={() => SelectUser(id)}>
                        Selecteren
                    </div>
                </div>
            </div>
        ),
        employeedatatemp
    );
    userPortalDivList.push(temp.portalListDivs);
    userPortalList.push(temp);
}*/

function FillUserDataList(portalPos) {
    // fills the list of registered users in mainView
    let tempList = document.createDocumentFragment();
    for (let a = 0; a < userPortalList[portalPos].registeredEmployeeList.length; a++) {
        let deleteUser = document.createElement('div');
        deleteUser.className = 'deleteUser';
        deleteUser.onclick = function () {
            DeleteUser(a, portalPos);
        };
        deleteUser.innerHTML = 'Verwijderen';

        let userItem = document.createElement('div');
        userItem.className = 'userItem';
        userItem.innerHTML =
            'ID: ' +
            userPortalList[portalPos].registeredEmployeeList[a].id +
            `<br />` +
            'Naam: ' +
            userPortalList[portalPos].registeredEmployeeList[a].name +
            '<br />' +
            'E-mail: ' +
            userPortalList[portalPos].registeredEmployeeList[a].contact;
        userItem.appendChild(deleteUser);

        let userItemBox = document.createElement('div');
        userItemBox.className = 'userItemBox';
        userItemBox.appendChild(userItem);

        tempList.appendChild(userItemBox);
    }

    document.getElementById('GbrToevoegenbutton').onclick = function () {
        if (
            document.getElementById('GbrNaamInvoer').value === '' ||
            document.getElementById('GbrEmailInvoer').value === '' ||
            document.getElementById('GbrPassInvoer').value === ''
        ) {
            document.getElementById('GbrNaamInvoer').value = '';
            document.getElementById('GbrEmailInvoer').value = '';
            document.getElementById('GbrPassInvoer').value = '';
            document.getElementById('Gbrtoevoegen').style.display = 'none';
            return;
        }
        /*        let temp = new EmployeeData(
            userPortalList[portalPos].registeredEmployeeList.length,
            document.getElementById('GbrNaamInvoer').value
        );
        temp.contact = document.getElementById('GbrEmailInvoer').value;

        userPortalList[portalPos].registeredEmployeeList.push(temp);*/
        userPortalList[portalPos].registeredEmployeeList.push(
            // user-ID
            document.getElementById('GbrEmailInvoer').value,
            1, // 1 is Role_Id
            document.getElementById('GbrNaamInvoer').value
        );

        let deleteUser = document.createElement('div');
        deleteUser.className = 'deleteUser';
        deleteUser.onclick = function () {
            DeleteUser(userPortalList[portalPos].registeredEmployeeList.length - 1, portalPos);
        };
        deleteUser.innerHTML = 'Verwijderen';

        let userItem = document.createElement('div');
        userItem.className = 'userItem';
        userItem.innerHTML =
            'ID: ' +
            (userPortalList[portalPos].registeredEmployeeList.length - 1) +
            `<br />` +
            'Naam: ' +
            document.getElementById('GbrNaamInvoer').value +
            '<br />' +
            'E-mail: ' +
            document.getElementById('GbrEmailInvoer').value;
        userItem.appendChild(deleteUser);

        let userItemBox = document.createElement('div');
        userItemBox.className = 'userItemBox';
        userItemBox.appendChild(userItem);
        document.getElementById('mainViewUserDataList').appendChild(userItemBox);

        document.getElementById('GbrNaamInvoer').value = '';
        document.getElementById('GbrEmailInvoer').value = '';
        document.getElementById('GbrPassInvoer').value = '';
        document.getElementById('Gbrtoevoegen').style.display = 'none';
    };

    return tempList;
}

function DeleteUser(pos, portalPos) {
    let registeredEmployeeListtemp = userPortalList[portalPos].registeredEmployeeList;
    registeredEmployeeListtemp[pos].id = null;
    registeredEmployeeListtemp[pos].name = null;
    userPortalList[portalPos].registeredEmployeeList = [];
    for (var a = 0; a < registeredEmployeeListtemp.length; a++) {
        if (registeredEmployeeListtemp[a].id !== null) {
            let employeedata = registeredEmployeeListtemp[a];
            userPortalList[portalPos].registeredEmployeeList.push(employeedata);
        }
    }
    document.getElementById('mainViewUserDataList').innerHTML = '';
    document.getElementById('mainViewUserDataList').appendChild(FillUserDataList(portalPos));
}

function FillTemplateList(portalPos) {
    let statsList = [];

    for (var a = 0; a < userPortalList[portalPos].importedTemplateList.length; a++) {
        let total = 0;
        let totalEuro = 0;
        for (var b = 0; b < userPortalList[portalPos].designList.length; b++) {
            if (
                userPortalList[portalPos].importedTemplateList[a].id ===
                    userPortalList[portalPos].designList[b].templateId &&
                userPortalList[portalPos].designList[b].downloaded === true
            ) {
                total++;
                totalEuro = totalEuro + 4.99;
            }
        }
        /*        let tempObj = new DownloadData(
            userPortalList[portalPos].importedTemplateList[a].id,
            userPortalList[portalPos].importedTemplateList[a].name,
            total,
            totalEuro
        );
        statsList.push(tempObj);*/
    }
    let tempList = document.createDocumentFragment();
    for (var c = 0; c < statsList.length; c++) {
        let ShowTemplate = document.createElement('div');
        ShowTemplate.className = 'ShowTemplate';
        let TempPos = statsList[c].id;
        ShowTemplate.onclick = function () {
            DrawPreview(portalPos, TempPos);
        };
        ShowTemplate.innerHTML = 'Bekijk Template';

        let TemplateItem = document.createElement('div');
        TemplateItem.className = 'TemplateItem';
        TemplateItem.innerHTML =
            'Naam: ' +
            statsList[c].name +
            `<br />` +
            'Aantal Downloads: ' +
            statsList[c].totalDL +
            `<br />` +
            "Euro's: " +
            statsList[c].totalEuroDL;

        TemplateItem.appendChild(ShowTemplate);

        let TemplateItemBox = document.createElement('div');
        TemplateItemBox.className = 'TemplateItemBox';
        TemplateItemBox.appendChild(TemplateItem);

        tempList.appendChild(TemplateItemBox);
    }
    return tempList;
}

function FillDesignList(portalPos, selectedTemplateId) {
    let tempDesignList = [];
    /*    for (let a = 0; a < userPortalList[portalPos].designList.length; a++) {
        if (selectedTemplateId === userPortalList[portalPos].designList[a].templateId) {
            let tempObj = new DesignData(
                selectedTemplateId,
                userPortalList[portalPos].designList[a].templateName,
                userPortalList[portalPos].designList[a].designName,
                userPortalList[portalPos].designList[a].downloaded
            );
            tempDesignList.push(tempObj);
        }
    }*/
    let tempList = document.createDocumentFragment();
    for (let b = 0; b < tempDesignList.length; b++) {
        let DesignItem = document.createElement('div');
        DesignItem.className = 'DesignItem';
        DesignItem.innerHTML =
            'Naam: ' +
            tempDesignList[b].designName +
            '<br />' +
            'Gebruikte Template: <br />' +
            tempDesignList[b].templateName +
            '<br />' +
            'Gedownload: ';
        DesignItem.innerHTML += tempDesignList[b].wasDL ? 'Ja' : 'Nee';

        let DesignItemBox = document.createElement('div');
        DesignItemBox.className = 'DesignItemBox';
        DesignItemBox.appendChild(DesignItem);
        tempList.appendChild(DesignItemBox);
    }
    return tempList;
}

function DrawPreview(portalPos, selectedTemplateId) {
    document.getElementById('Gbrtoevoegen').style.display = 'none';
    document.getElementById('mainViewTemplatePreview').style.display = 'block';
    document.getElementById('mainViewDesigns').style.display = 'block';
    document.getElementById('mainViewDesignsList').innerHTML = '';
    document
        .getElementById('mainViewDesignsList')
        .appendChild(FillDesignList(portalPos, selectedTemplateId));
}

function GbrToevoegen() {
    document.getElementById('mainViewTemplatePreview').style.display = 'none';
    document.getElementById('mainViewDesigns').style.display = 'none';
    document.getElementById('Gbrtoevoegen').style.display = 'block';
}

function ChangeCompanyName(portalPos) {
    let companyInput = prompt('Voer de nieuwe bedrijfsnaam in.');
    while (companyInput === '') {
        companyInput = prompt('Voer opnieuw de nieuwe bedrijfsnaam in. (mag niet leeg zijn)');
    }
    document.getElementById('userPortalItemCompanyselector ' + portalPos).innerHTML = companyInput;
    document.getElementById('mainViewHeaderText').innerHTML =
        `<h1>User Portal ` +
        userPortalList[portalPos - 1].portalId +
        `</h1>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<p class="CompanyName">` +
        document.getElementById('userPortalItemCompanyselector ' + portalPos).innerHTML +
        `</p>`;
}

function DeleteUserPortalStep(portalPos, deletePortal) {
    if (!deletePortal) {
        document.getElementById('DeletePortalTxt').style.display = 'block';
        document.getElementById('DeletePortalConfirm').style.display = 'flex';
        return;
    }
    document.getElementById('mainView').style.display = 'none';
    userPortalList.splice(portalPos, 1);
    userPortalDivList.splice(portalPos, 1);
}

export default CreateExport('/admin-portal', AdminPortal, true, ['Admin']);
