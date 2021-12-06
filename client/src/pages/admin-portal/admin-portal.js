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
    let portalArray = [];
    // sets the arrays w data in them from the database
    let companyListDb = await ApiInstance.all('company');
    let companyList = Enumerable.from(companyListDb.content).toArray();
    let userListDb = await ApiInstance.all('user');
    let userList = Enumerable.from(userListDb.content).toArray();
    let templateListDb = await ApiInstance.all('template');
    var templateList = Enumerable.from(templateListDb.content).toArray();
    let designListDb = await ApiInstance.all('design');
    let designList = Enumerable.from(designListDb.content).toArray();

    for (let listPos = 0; listPos < companyList.length; listPos++) {
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
            .where((u) => u.Company_Id === companyList[listPos].Id && u.Role_Id === 3)
            .toArray();

        // makes new user-portal w cool new data
        let temp = new UserPortalData(
            companyList[listPos].Id,
            listPos,
            companyList[listPos].Name,
            adminUser,
            userListTemp,
            templateListTemp,
            designListTemp
        );

        portalArray.push(temp);
    }
    return portalArray;
}

class UserPortalData {
    constructor(DbId, id, companyName, mainUser, employeeList, templateList, designList) {
        this.DbId = DbId;
        this.portalId = id;
        this.companyName = companyName; // get from database
        this.mainUserList = mainUser;
        this.registeredEmployeeList = employeeList; //get from database; is {id: id, name: name}
        this.importedTemplateList = templateList;
        this.designList = designList;
    }
}

let portalPosition = -1;

function AdminPortal() {
    const [userPortalList, SetUserPortalList] = React.useState([]);

    React.useEffect(() => {
        (async () => {
            SetUserPortalList(await getData());
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
                        {userPortalList.map((data) => {
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
                                            onClick={() => {
                                                document.getElementById(
                                                    'addUserPortal'
                                                ).style.display = 'none';
                                                SelectUser(
                                                    'selector ' + data.portalId,
                                                    userPortalList,
                                                    SetUserPortalList
                                                );
                                            }}
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
                        onClick={() => {
                            document.getElementById('mainView').style.display = 'none';
                            document.getElementById('addUserPortal').style.display = 'flex';
                        }}
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
                        <img
                            className="FotoGalleryButton"
                            src={FotoGalleryImg}
                            alt="gallery"
                            onClick={function () {
                                window.open('/fotogalerij', '_blank').focus();
                            }}
                        />
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
                            <div
                                className="HoofdgebruikerWijzigen"
                                onClick={() =>
                                    hoofdgebruikerWijzigen(userPortalList, SetUserPortalList)
                                }
                            >
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
                                Wachtwoord: <input type="password" id="GbrPassInvoer" />
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
                <div className="addUserPortal" id="addUserPortal">
                    <div className="newUserPortalHeaders">
                        <div className="newCompanyHeader">Bedrijf gegevens</div>
                        <div className="newMainUserHeader">Hoofdgebruiker</div>
                    </div>
                    <div className="newCompanyData">
                        <div className="CompanyInput">
                            Naam:{' '}
                            <input
                                style={{ marginLeft: '25px', width: '75.6%' }}
                                type="text"
                                id="newCompanyName"
                            />
                        </div>
                        <div className="CompanyInput">
                            Telefoon:{' '}
                            <input
                                style={{ marginLeft: '5px', width: '75.6%' }}
                                type="text"
                                id="newCompanyPhone"
                            />
                        </div>
                        <div className="CompanyInput">
                            Email:{' '}
                            <input
                                style={{ marginLeft: '28px', width: '75.6%' }}
                                type="text"
                                id="newCompanyEmail"
                            />
                        </div>
                        <div className="CompanyInput">
                            Land:{' '}
                            <input
                                style={{ marginLeft: '32px', width: '75.6%' }}
                                type="text"
                                id="newCompanyCountry"
                            />
                        </div>
                        <div className="CompanyInput">
                            Plaats + postcode:{' '}
                            <input
                                style={{ marginLeft: '5px', width: '40.8%' }}
                                type="text"
                                id="newCompanyCity"
                            />
                            <input
                                style={{ marginLeft: '5px', width: '13.5%' }}
                                type="text"
                                id="newCompanyPostcode"
                            />
                        </div>
                        <div className="CompanyInput">
                            Straat + huisnummer:{' '}
                            <input
                                style={{ marginLeft: '5px', width: '35%' }}
                                type="text"
                                id="newCompanyStreet"
                            />
                            <input
                                style={{ marginLeft: '5px', width: '13.5%' }}
                                type="text"
                                id="newCompanyHouseNumer"
                            />
                        </div>
                    </div>
                    <div className="newMainUserData">
                        <div className="CompanyInput">
                            Naam:{' '}
                            <input
                                style={{ marginLeft: '25px', width: '75.6%' }}
                                type="text"
                                id="newMainUserName"
                            />
                        </div>
                        <div className="CompanyInput">
                            Email:{' '}
                            <input
                                style={{ marginLeft: '29px', width: '75.6%' }}
                                type="text"
                                id="newMainUserEmail"
                            />
                        </div>
                        <div className="CompanyInput">
                            Wachtwoord:{' '}
                            <input
                                style={{ marginLeft: '29px', width: '61.3%' }}
                                type="password"
                                id="newMainUserPassword"
                            />
                        </div>
                    </div>
                    <div
                        className="AddNewUserPortalButton"
                        onClick={() => portalToevoegen(SetUserPortalList)}
                    >
                        Nieuwe user portal toevoegen
                    </div>
                </div>
            </div>
        </div>
    );
}

function SelectUser(id, userPortalList, SetUserPortalList) {
    const pos = id.replace('selector ', '');
    portalPosition = pos;
    document.getElementById('mainView').style.display = 'flex';

    // unloads any menu's from a previously selected user-portal
    document.getElementById('mainViewTemplatePreview').style.display = 'none';
    document.getElementById('mainViewDesigns').style.display = 'none';
    document.getElementById('DeletePortalTxt').style.display = 'none';
    document.getElementById('DeletePortalConfirm').style.display = 'none';

    // sets relevant data for header (portal id, company name)
    document.getElementById('mainViewHeaderText').innerHTML =
        `<h1>User Portal ` +
        (userPortalList[pos].portalId + 1) +
        `</h1>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<p class="CompanyName">` +
        document.getElementById('userPortalItemCompanyselector ' + pos).innerHTML +
        `</p>`;

    // sets relevant data for main user display (id, name, e-mail)
    if (userPortalList[pos].mainUserList) {
        document.getElementById('mainViewUserData').innerHTML =
            `<p class="mainViewUserDataText" id="mainViewUserDataText">ID: ` +
            userPortalList[pos].mainUserList.Id +
            `<br/>` +
            'Naam: ' +
            userPortalList[pos].mainUserList.Name +
            `<br/>` +
            'E-mail: ' +
            userPortalList[pos].mainUserList.Email +
            `</p><div class="changeMainUserText" id="changeMainUserText">Naam gebruiker:
            <input type="text" class="changeMainUser" id="changeMainUser"/>
            <div class="setNewMainUser" id="setNewMainUser">Maak hoofdgebruiker</div></div>`;
    }

    // sets relevant data for users in portal
    document.getElementById('mainViewUserDataList').innerHTML = '';
    document
        .getElementById('mainViewUserDataList')
        .appendChild(FillUserDataList(pos, userPortalList));

    // sets relevant data for download stats
    document.getElementById('mainViewTemplatesList').innerHTML = '';
    document
        .getElementById('mainViewTemplatesList')
        .appendChild(FillTemplateList(pos, userPortalList));

    // adds onclick to bedrijfnaam wijzigen & delete user-portal buttons
    document.getElementById('BedrijfnaamWijzigen').onclick = function () {
        ChangeCompanyName(pos, userPortalList);
    };
    document.getElementById('DeletePortal').onclick = function () {
        DeleteUserPortalStep(pos, false, userPortalList, SetUserPortalList);
    };
    document.getElementById('DeletePortalConfirm').onclick = function () {
        DeleteUserPortalStep(pos, true, userPortalList, SetUserPortalList);
    };

    // continue making selection screen
    /* verhouding a4:
        element.style.width = '459px'; 
        element.style.height = '650px';
        1 : 1.416
    */
}

function FillUserDataList(portalPos, userPortalList) {
    // fills the list of registered users in mainView
    let tempList = document.createDocumentFragment();
    for (let a = 0; a < userPortalList[portalPos].registeredEmployeeList.length; a++) {
        let deleteUser = document.createElement('div');
        deleteUser.className = 'deleteUser';
        deleteUser.onclick = function () {
            DeleteUser(a, portalPos, userPortalList);
        };
        deleteUser.innerHTML = 'Verwijderen';

        let userItem = document.createElement('div');
        userItem.className = 'userItem';
        userItem.innerHTML =
            'ID: ' +
            userPortalList[portalPos].registeredEmployeeList[a].Id +
            `<br />` +
            'Naam: ' +
            userPortalList[portalPos].registeredEmployeeList[a].Name +
            '<br />' +
            'E-mail: ' +
            userPortalList[portalPos].registeredEmployeeList[a].Email;
        userItem.appendChild(deleteUser);

        let userItemBox = document.createElement('div');
        userItemBox.className = 'userItemBox';
        userItemBox.appendChild(userItem);

        tempList.appendChild(userItemBox);
    }

    document.getElementById('GbrToevoegenbutton').onclick = async function () {
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
        const ApiInstance = new Api(getToken());
        // sets the arrays w data in them from the database

        const result = await ApiInstance.create('user', [
            document.getElementById('GbrEmailInvoer').value,
            document.getElementById('GbrPassInvoer').value,
            3,
            document.getElementById('GbrNaamInvoer').value,
            userPortalList[portalPos].DbId,
            0,
        ]);

        if (result.status === 'FAIL') return;

        let userListDb = await ApiInstance.all('user');
        let userList = Enumerable.from(userListDb.content)
            .where((u) => u.Company_Id === userPortalList[portalPos].DbId && u.Role_Id === 3)
            .toArray();
        userPortalList[portalPos].registeredEmployeeList = userList;

        let deleteUser = document.createElement('div');
        deleteUser.className = 'deleteUser';
        deleteUser.onclick = function () {
            DeleteUser(
                userPortalList[portalPos].registeredEmployeeList.length - 1,
                portalPos,
                userPortalList
            );
        };
        deleteUser.innerHTML = 'Verwijderen';

        let userItem = document.createElement('div');
        userItem.className = 'userItem';
        userItem.innerHTML =
            'ID: ' +
            userList[userList.length - 1].Id +
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

async function DeleteUser(pos, portalPos, userPortalList) {
    const ApiInstance = new Api(getToken());
    const result = await ApiInstance.delete(
        'user',
        userPortalList[portalPos].registeredEmployeeList[pos].Id
    );
    if (result.status === 'FAIL') return;

    let userListDb = await ApiInstance.all('user');
    let userList = Enumerable.from(userListDb.content).toArray();
    userPortalList[portalPos].registeredEmployeeList = Enumerable.from(userList)
        .where((u) => u.Company_Id === userPortalList[portalPos].DbId && u.Role_Id === 3)
        .toArray();

    document.getElementById('mainViewUserDataList').innerHTML = '';
    document
        .getElementById('mainViewUserDataList')
        .appendChild(FillUserDataList(portalPos, userPortalList));
}

function FillTemplateList(portalPos, userPortalList) {
    let statsList = [];
    for (var a = 0; a < userPortalList[portalPos].importedTemplateList.length; a++) {
        let total = 0;
        let totalEuro = 0;
        for (var b = 0; b < userPortalList[portalPos].designList.length; b++) {
            if (
                userPortalList[portalPos].importedTemplateList[a].Id ===
                    userPortalList[portalPos].designList[b].Template_id &&
                userPortalList[portalPos].designList[b].Downloads > 0
            ) {
                total += userPortalList[portalPos].designList[b].Downloads;
                totalEuro = totalEuro + 4.99;
            }
        }

        statsList.push(
            // maak hier n dictionary van
            {
                Id: userPortalList[portalPos].importedTemplateList[a].Id,
                name: userPortalList[portalPos].importedTemplateList[a].Name,
                total: total,
                totalEuro: totalEuro,
            }
        );
    }
    let tempList = document.createDocumentFragment();
    for (var c = 0; c < statsList.length; c++) {
        let ShowTemplate = document.createElement('div');
        ShowTemplate.className = 'ShowTemplate';
        let TempPos = statsList[c].Id;
        let name = statsList[c].name;
        ShowTemplate.onclick = function () {
            DrawPreview(portalPos, TempPos, userPortalList, name);
        };
        ShowTemplate.innerHTML = 'Bekijk Template';

        let TemplateItem = document.createElement('div');
        TemplateItem.className = 'TemplateItem';
        TemplateItem.innerHTML =
            'Naam: ' +
            statsList[c].name +
            `<br />` +
            'Aantal Downloads: ' +
            statsList[c].total +
            `<br />` +
            "Euro's: " +
            statsList[c].totalEuro;

        TemplateItem.appendChild(ShowTemplate);

        let TemplateItemBox = document.createElement('div');
        TemplateItemBox.className = 'TemplateItemBox';
        TemplateItemBox.appendChild(TemplateItem);

        tempList.appendChild(TemplateItemBox);
    }
    return tempList;
}

function FillDesignList(portalPos, selectedTemplateId, userPortalList, templateName) {
    let tempDesignList = [];
    for (let a = 0; a < userPortalList[portalPos].designList.length; a++) {
        if (selectedTemplateId === userPortalList[portalPos].designList[a].Template_id) {
            tempDesignList.push({
                Name: userPortalList[portalPos].designList[a].Name,
                Downloads: userPortalList[portalPos].designList[a].Downloads,
            });
        }
    }
    let tempList = document.createDocumentFragment();
    for (let b = 0; b < tempDesignList.length; b++) {
        let DesignItem = document.createElement('div');
        DesignItem.className = 'DesignItem';
        DesignItem.innerHTML =
            'Naam: ' +
            tempDesignList[b].Name +
            '<br />' +
            'Gebruikte Template: <br />' +
            templateName +
            '<br />' +
            'Downloads: ';
        DesignItem.innerHTML +=
            tempDesignList[b].Downloads > 0 ? tempDesignList[b].Downloads : 'geen';

        let DesignItemBox = document.createElement('div');
        DesignItemBox.className = 'DesignItemBox';
        DesignItemBox.appendChild(DesignItem);
        tempList.appendChild(DesignItemBox);
    }
    return tempList;
}

function DrawPreview(portalPos, selectedTemplateId, userPortalList, templateName) {
    document.getElementById('Gbrtoevoegen').style.display = 'none';
    document.getElementById('mainViewTemplatePreview').style.display = 'block';
    document.getElementById('mainViewDesigns').style.display = 'block';
    document.getElementById('mainViewDesignsList').innerHTML = '';
    document
        .getElementById('mainViewDesignsList')
        .appendChild(FillDesignList(portalPos, selectedTemplateId, userPortalList, templateName));
}

function GbrToevoegen() {
    document.getElementById('mainViewTemplatePreview').style.display = 'none';
    document.getElementById('mainViewDesigns').style.display = 'none';
    document.getElementById('Gbrtoevoegen').style.display = 'block';
}

async function ChangeCompanyName(portalPos, userPortalList) {
    let companyInput = prompt('Voer de nieuwe bedrijfsnaam in.');
    while (companyInput === '') {
        companyInput = prompt('Voer opnieuw de nieuwe bedrijfsnaam in. (mag niet leeg zijn)');
    }
    console.log(userPortalList[portalPos].companyName);
    userPortalList[portalPos].companyName = companyInput;
    const ApiInstance = new Api(getToken());
    const companyListDb = await ApiInstance.read('company', userPortalList[portalPos].DbId);
    const companyList = companyListDb.content;
    const result = await ApiInstance.update('company', companyList[0].Id, [
        userPortalList[portalPos].companyName,
        companyList[0].Phonenumber,
        companyList[0].Email,
        companyList[0].Country,
        companyList[0].City,
        companyList[0].Postcode,
        companyList[0].Streetname,
        companyList[0].Housenumber,
    ]);
    console.log(result);

    document.getElementById('userPortalItemCompanyselector ' + portalPos).innerHTML = companyInput;
    document.getElementById('mainViewHeaderText').innerHTML =
        `<h1>User Portal ` +
        (userPortalList[portalPos].portalId + 1) +
        `</h1>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<p class="CompanyName">` +
        document.getElementById('userPortalItemCompanyselector ' + portalPos).innerHTML +
        `</p>`;
}

async function DeleteUserPortalStep(portalPos, deletePortal, userPortalList, SetUserPortalList) {
    if (!deletePortal) {
        document.getElementById('DeletePortalTxt').style.display = 'block';
        document.getElementById('DeletePortalConfirm').style.display = 'flex';
        return;
    }
    document.getElementById('mainView').style.display = 'none';
    const delUserIdList = Enumerable.from(userPortalList[portalPos].registeredEmployeeList)
        .where((u) => u.Company_Id === userPortalList[portalPos].DbId)
        .select((i) => i.Id)
        .toArray();
    console.log(delUserIdList);
    const ApiInstance = new Api(getToken());
    let result = await ApiInstance.delete('company', userPortalList[portalPos].DbId);
    console.log(result);

    if (result.status !== 'SUCCESS') return;

    for (var a = 0; a < delUserIdList.length; a++) {
        result = await ApiInstance.delete('user', delUserIdList[a]);
        console.log(result);
    }

    SetUserPortalList(
        Enumerable.from(userPortalList)
            .where((p) => p.DbId !== userPortalList[portalPos].DbId)
            .toArray()
    );
}

async function portalToevoegen(SetUserPortalList) {
    if (
        document.getElementById('newCompanyName').value === '' ||
        document.getElementById('newCompanyEmail').value === '' ||
        document.getElementById('newCompanyCountry').value === '' ||
        document.getElementById('newCompanyCity').value === '' ||
        document.getElementById('newCompanyPostcode').value === '' ||
        document.getElementById('newCompanyStreet').value === '' ||
        document.getElementById('newCompanyHouseNumer').value === '' ||
        document.getElementById('newMainUserName').value === '' ||
        document.getElementById('newMainUserEmail').value === '' ||
        document.getElementById('newMainUserPassword').value === ''
    )
        return;

    const ApiInstance = new Api(getToken());
    let response = await ApiInstance.create('company', [
        document.getElementById('newCompanyName').value,
        document.getElementById('newCompanyPhone').value,
        document.getElementById('newCompanyEmail').value,
        document.getElementById('newCompanyCountry').value,
        document.getElementById('newCompanyCity').value,
        document.getElementById('newCompanyPostcode').value,
        document.getElementById('newCompanyStreet').value,
        document.getElementById('newCompanyHouseNumer').value,
    ]);
    const companyListDb = await ApiInstance.all('company');
    const companyList = Enumerable.from(companyListDb.content).toArray();

    response = await ApiInstance.create('user', [
        document.getElementById('newMainUserEmail').value,
        document.getElementById('newMainUserPassword').value,
        2,
        document.getElementById('newMainUserName').value,
        companyList[companyList.length - 1].Id,
        0,
    ]);

    console.log(response);

    document.getElementById('newCompanyName').value = '';
    document.getElementById('newCompanyEmail').value = '';
    document.getElementById('newCompanyPhone').value = '';
    document.getElementById('newCompanyCountry').value = '';
    document.getElementById('newCompanyCity').value = '';
    document.getElementById('newCompanyPostcode').value = '';
    document.getElementById('newCompanyStreet').value = '';
    document.getElementById('newCompanyHouseNumer').value = '';
    document.getElementById('newMainUserName').value = '';
    document.getElementById('newMainUserEmail').value = '';
    document.getElementById('newMainUserPassword').value = '';
    document.getElementById('addUserPortal').style.display = 'none';
    SetUserPortalList(await getData());
}

function hoofdgebruikerWijzigen(userPortalList, SetUserPortalList) {
    document.getElementById('mainViewUserDataText').style.display = 'none';
    document.getElementById('mainViewUserData').style.display = 'flex';
    document.getElementById('changeMainUserText').style.display = 'flex';
    document.getElementById('setNewMainUser').onclick = async function () {
        console.log(userPortalList[portalPosition].registeredEmployeeList);
        if (
            document.getElementById('changeMainUser').value !== '' &&
            Enumerable.from(userPortalList[portalPosition].registeredEmployeeList)
                .select((u) => u.Name)
                .contains(document.getElementById('changeMainUser').value)
        ) {
            const oldMainUser = userPortalList[portalPosition].mainUserList;
            const NewMainUser = Enumerable.from(
                userPortalList[portalPosition].registeredEmployeeList
            )
                .where((u) => u.Name === document.getElementById('changeMainUser').value)
                .toArray();
            const ApiInstance = new Api(getToken());
            let result = await ApiInstance.update(
                'user',
                userPortalList[portalPosition].mainUserList.Id,
                [
                    userPortalList[portalPosition].mainUserList.Email,
                    userPortalList[portalPosition].mainUserList.Password,
                    3,
                    userPortalList[portalPosition].mainUserList.Name,
                    userPortalList[portalPosition].mainUserList.Company_Id,
                    userPortalList[portalPosition].mainUserList.Is_logged_on,
                ]
            );

            if (result.status !== 'SUCCESS') return;

            result = await ApiInstance.update('user', NewMainUser[0].Id, [
                NewMainUser[0].Email,
                NewMainUser[0].Password,
                2,
                NewMainUser[0].Name,
                NewMainUser[0].Company_Id,
                NewMainUser[0].Is_logged_on,
            ]);

            if (result.status !== 'SUCCESS') return;

            userPortalList[portalPosition].registeredEmployeeList.push(
                userPortalList[portalPosition].mainUserList
            );
            console.log('List of user ids: ');
            console.log(
                Enumerable.from(userPortalList[portalPosition].registeredEmployeeList)
                    .select((u) => u.Id)
                    .toArray()
            );
            console.log('Id old main user: ' + oldMainUser.Id);
            userPortalList[portalPosition].registeredEmployeeList.splice(
                Enumerable.from(userPortalList[portalPosition].registeredEmployeeList)
                    .select((u) => u.Id)
                    .indexOf(oldMainUser.Id) - 1,
                1
            );
            console.log('User list + old main user and - new main user: ');
            console.log(userPortalList[portalPosition].registeredEmployeeList);
            userPortalList[portalPosition].mainUserList = NewMainUser[0];

            document.getElementById('mainViewUserDataText').style.display = 'block';
            document.getElementById('mainViewUserData').style.display = 'block';
            document.getElementById('changeMainUserText').style.display = 'none';
            SelectUser(
                'selector ' + userPortalList[portalPosition].portalId,
                userPortalList,
                SetUserPortalList
            );
            return;
        }
        console.log('you done wrong');
        //alert
    };
}

export default CreateExport('/admin-portal', AdminPortal, true, ['Admin']);
