import * as React from 'react';
import './admin-portal.css';
import kyndaLetter from './kyndaletter.png';
import cog from './cog69420.png';
import FotoGalleryImg from './photolibicon.jpg';

class UserPortalData {
    constructor(id, divs, employeedata) {
        this.portalId = id;
        this.portalListDivs = divs; // are the divs that appear in the userportal list on the side
        this.companyName = 'S.T.D. Wines & Liquors inc.'; // get from database
        this.mainUserList = {
            id: 69420,
            name: 'Barend Ballebak',
            contact: 'barendballebak@email.nl',
        }; // get from database; is {id: id, name: name, contact: contact}, also can be more than 1 (should we even allow more? idk)
        this.registeredEmployeeList = employeedata; //get from database; is {id: id, name: name}
        this.importedTemplateList = [
            { id: 6, name: 'Billboard 1' },
            { id: 8, name: 'Newspaper 3' },
            { id: 21, name: 'Website layout 5' },
        ]; // get from database; is [templateId, templateId...]
        this.designList = [
            { designName: 'Billboard take 1', templateId: 6, downloaded: false },
            { designName: 'NewspaperAd Kompas', templateId: 8, downloaded: true },
        ]; // get from database; is [{designName: string, templateId: int, downloaded: bool}, ...]
    }
}

class EmployeeData {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}

class DownloadData {
    constructor(name, totalDL, totalEuroDL) {
        this.name = name;
        this.totalDL = totalDL;
        this.totalEuroDL = totalEuroDL;
    }
}

const userPortalAmount = 10; // temp value, should be amount of user-portals, get from database
let userPortalDivList = []; // array for divs
let userPortalList = []; // array of UserPortalData objects

DrawUserPortals();

function AdminPortal() {
    const [userPortalList1, SetUserPortalList] = React.useState([]);
    return (
        <React.Fragment>
            {/* menubar bijna tzelfde als die in user-portal.js */}
            <div class="menuBarAdmin">
                <div class="kyndaLogo">
                    <img src={kyndaLetter} width="104" height="55" />
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
                    <loguitbutton>Uitloggen</loguitbutton>
                </div>
                <div class="kyndaCog">
                    <img src={cog} width="40" height="40" />
                </div>
            </div>

            <div class="mainPage">
                <div class="listViewTxtBox">
                    <p class="listViewTxt">User Portals</p>
                </div>
                <div class="midSection">
                    <div class="userPortalList" id="userPortalList">
                        {userPortalDivList}
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
                            <img className="FotoGalleryButton" src={FotoGalleryImg} />
                            <div className="ImportTemplateButon">
                                <h3>Import template</h3>
                            </div>
                            <div className="DoubleButtons">
                                <div className="HoofdgebruikerWijzigen">
                                    <h3>Hoofdgebruker account wijzigen</h3>
                                </div>
                                <div className="BedrijfnaamWijzigen">
                                    <h3>Bedrijfnaam wijzigen</h3>
                                </div>
                            </div>
                            <div className="DeletePortal">
                                <h3>Delete user-portal</h3>
                            </div>
                        </div>
                        <div className="MainViewBottom">
                            <div class="mainViewUserList">
                                <div className="mainViewUserDataHeader">
                                    Geregistreerde gebruikers
                                </div>
                                <div
                                    class="mainViewUserDataList"
                                    id="mainViewUserDataList"
                                ></div>
                            </div>
                            <div class="mainViewTemplates">
                                <div class="mainViewTemplatesHeader">Templates</div>
                                <div
                                    class="mainViewTemplatesList"
                                    id="mainViewTemplatesList"
                                ></div>
                            </div>
                            <div
                                class="mainViewTemplatePreview"
                                id="mainViewTemplatePreview"
                            ></div>
                            <div class="mainViewDesigns" id="mainViewDesigns">
                                <div class="mainViewDesignsHeader">Desings</div>
                                <div class="mainViewDesignsList" id="mainViewDesignsList"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="listViewTxtBox">
                    <p
                        class="addUserPortalButton"
                        onClick={() =>
                            SetUserPortalList(userPortalDivList.push(AddUserPortal()))
                        }
                    >
                        User Portal Toevoegen
                    </p>
                </div>
            </div>
        </React.Fragment>
    );
}

export default {
    url: '/admin-portal',
    auth: true,
    adminOnly: true,
    component: AdminPortal,
};

function DrawUserPortals() {
    // function to generate user-portal list-view

    for (let listPos = 1; listPos <= userPortalAmount; listPos++) {
        let id = 'selector ' + listPos;
        let temp = new UserPortalData(
            listPos,
            (
                <div class="userPortalItemBox">
                    <div class="userPortalItem">
                        {'User Portal ' + listPos} <br />
                        {'S.T.D. Wines & Liquors inc.'} {/* get company name from method call */}
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
    ];
    let employeedatatemp = [];
    for (var a = 0; a < names.length; a++) {
        let employeedata = new EmployeeData(a, names[a]);
        employeedatatemp.push(employeedata);
    }

    return employeedatatemp;
}

function SelectUser(id) {
    const pos = id.replace('selector ', '');
    document.getElementById('mainView').style.display = 'flex';

    // sets relevant data for header (portal id, company name)
    document.getElementById('mainViewHeaderText').innerHTML =
        `<h1>User Portal ` +
        userPortalList[pos - 1].portalId +
        `</h1>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<p class="CompanyName">` +
        userPortalList[pos - 1].companyName +
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

    // continue making selection screen
    /* verhouding a4:
        element.style.width = '459px'; 
        element.style.height = '650px';
        1 : 1.416
    */
}

function AddUserPortal() {
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
    ];
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
                    {'User Portal ' + (userPortalList.length + 1)} <br />
                    {'S.T.D. Wines & Liquors inc.'}
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
}

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
            userPortalList[portalPos].registeredEmployeeList[a].name;
        userItem.appendChild(deleteUser);

        let userItemBox = document.createElement('div');
        userItemBox.className = 'userItemBox';
        userItemBox.appendChild(userItem);

        tempList.appendChild(userItemBox);
    }
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
        let tempObj = new DownloadData(
            userPortalList[portalPos].importedTemplateList[a].name,
            total,
            totalEuro
        );
        statsList.push(tempObj);
    }
    let tempList = document.createDocumentFragment();
    for (var c = 0; c < statsList.length; c++) {
        let ShowTemplate = document.createElement('div');
        ShowTemplate.className = 'ShowTemplate';
        ShowTemplate.onclick = function () {
            DrawPreview();
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

function DrawPreview() {
    document.getElementById('mainViewTemplatePreview').style.display = 'block';
    document.getElementById('mainViewDesigns').style.display = 'block';
    document.getElementById('mainViewDesignsList').innerHTML = '';
}
