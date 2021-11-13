import * as React from 'react';
import './admin-portal.css';
import kyndaLetter from './kyndaletter.png';
import cog from './cog69420.png';

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
        this.importedTemplateList = [6, 8, 21]; // get from database; is [templateId, templateId...]
        this.designList = [
            { designName: 'Billboard take 1', templateId: 6, downloaded: false },
            { designName: 'NewspaperAd Kompas', templateId: 8, downloaded: true }
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
    constructor(id, totalDL, totalEuroDL) {
        this.id = id;
        this.totalDL = totalDL;
        this.totalEuroDL = totalEuroDL;
    }
}

const userPortalAmount = 10; // temp value, should be amount of user-portals, get from database
let userPortalDivList = []; // array for divs
let userPortalList = []; // array of UserPortalData objects

DrawUserPortals();

export default {
    url: '/admin-portal',
    Render: (queryParams) => {
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
                            <div class="mainViewLeft">
                                <div class="mainViewLeftTop" id="mainViewLeftTop">
                                    <div class="mainViewHeader" id="mainViewHeader"></div>
                                    <div class="mainViewCompany" id="mainViewCompany"></div>
                                </div>
                                <div class="mainViewLeftUser" id="mainViewLeftUser">
                                    <div class="mainViewLeftUserHeader" id="mainViewLeftUserHeader">
                                        Hoofdgebruiker
                                    </div>
                                    <div class="mainViewLeftUserData">
                                        <div
                                            class="mainViewLeftUserId"
                                            id="mainViewLeftUserId"
                                        ></div>
                                        <div
                                            class="mainViewLeftUserName"
                                            id="mainViewLeftUserName"
                                        ></div>
                                        <div
                                            class="mainViewLeftUserContact"
                                            id="mainViewLeftUserContact"
                                        ></div>
                                    </div>
                                </div>
                                <div class="mainViewLeftLists">
                                    {' '}
                                    {/*Div met lijst uers + header*/}
                                    <div class="mainViewLeftUserList">
                                        <div
                                            class="mainViewLeftUserDataHeader"
                                            id="mainViewLeftUserDataHeader"
                                        >
                                            {' '}
                                            {/*Div header box*/}
                                            Geregistreerde gebruikers
                                        </div>
                                        <div
                                            class="mainViewLeftUserDataList"
                                            id="mainViewLeftUserDataList"
                                        ></div>{' '}
                                        {/*Div met lijst alle gebruikers*/}
                                    </div>
                                    <div class="mainViewLeftDownloads">
                                        <div class="mainViewLeftDownloadsHeader">Dowloads</div>
                                        <div
                                            class="mainViewLeftDownloadsList"
                                            id="mainViewLeftDownloadsList"
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/*<div class="downloadstatistics">
                            <div class="templatedownloadsbox">
                                <div class="statheader">Templates</div>
                                {drawstatisticstemplates()}
                            </div>
                            <div class="designdownloadsbox">
                                <div class="statheader">Designs</div>
                                {drawstatisticsdesigns()}
                            </div>
                        </div>*/}
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
    },
};

function DrawUserPortals() {
    // function to generate user-portal list-view
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
            employeedatatemp
        );
        userPortalDivList.push(temp.portalListDivs);
        userPortalList.push(temp);
    }
}

function SelectUser(id) {
    const pos = id.replace('selector ', '');
    document.getElementById('mainView').style.display = 'block';

    // sets relevant data for header (portal id, company name)
    document.getElementById('mainViewHeader').innerHTML =
        'User Portal ' + userPortalList[pos - 1].portalId;
    document.getElementById('mainViewCompany').innerHTML = userPortalList[pos - 1].companyName;

    // sets relevant data for main user display (id, name, e-mail)
    document.getElementById('mainViewLeftUserId').innerHTML =
        'ID: ' + userPortalList[pos - 1].mainUserList.id;
    document.getElementById('mainViewLeftUserName').innerHTML =
        'Naam: ' + userPortalList[pos - 1].mainUserList.name;
    document.getElementById('mainViewLeftUserContact').innerHTML =
        'E-mail: ' + userPortalList[pos - 1].mainUserList.contact;

    // sets relevant data for users in portal
    document.getElementById('mainViewLeftUserDataList').innerHTML = FillUserDataList(pos - 1);

    // sets relevant data for download stats
    document.getElementById('mainViewLeftDownloadsList').innerHTML = FillDownloadList(pos - 1);

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
    let tempList = '';
    for (let a = 0; a < userPortalList[portalPos].registeredEmployeeList.length; a++) {
        let deleteUser = document.createElement('div');
        deleteUser.className = 'deleteUser';
        deleteUser.setAttribute('onClick', 'DeleteUser(' + a + ',' + portalPos + ');');
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

        tempList = tempList + userItemBox.outerHTML;
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
    console.log('test');
    document.getElementById('mainViewLeftUserDataList').innerHTML = FillUserDataList(portalPos);
}

function FillDownloadList(portalPos) {
    let tempList = '';
    let statsList = [];
    
    for (var a = 0; a < userPortalList[portalPos].importedTemplateList.length; a++) {
        let total = 0;
        let totalEuro = 0;
        for (var b = 0; b < userPortalList[portalPos].designList.length; b++) {
            if (
                 userPortalList[portalPos].importedTemplateList[a] ===
                    userPortalList[portalPos].designList[b].templateId &&
                userPortalList[portalPos].designList[b].downloaded === true
            ) {
                total++;
                totalEuro = totalEuro + 4.99;
            }
        }
        let tempObj = new DownloadData(
            userPortalList[portalPos].importedTemplateList[a],
            total,
            totalEuro
        );
        statsList.push(tempObj);
    }
    for (var c = 0; c < statsList.length; c++) {
        tempList =
            tempList +
            '<div class="DownloadItemBox">' +
            '<div class="DownloadItem">' +
            'Template ID: ' +
            statsList[c].id +
            '<br />' +
            'Aantal Downloads: ' +
            statsList[c].totalDL +
            '<br />' +
            "Euro's: " +
            statsList[c].totalEuroDL +
            '</div>' +
            '</div>';
    }
    return tempList;
}

/*function drawstatisticstemplates() {
    let templates = {1: 5, 2: 11, 3: 10, 4: 6, 5: 4, 6: 20, 7: 11, 8: 16, 9: 2, 10: 43}; // temp value, is dictionary with key=templateId & value=downloadamount, get from database (not sure if downloads have to be per template & per user portal or just per template)
    let stats = [];
    for (var key in templates) {
        stats.push(
            <div class="templatedownloads"> 
                <div class="templatedownloadstxt">
                    Template {key} <br/>
                    Aantal Downloads = {templates[key]}
                </div>
            </div>
        );
    }
    return stats;
}

function drawstatisticsdesigns() {
    let designs = {1: 22, 2: 3, 3: 741, 4: 9, 5: 20, 6: 14, 7: 10, 8: 41, 9: 7, 10: 89}; // temp value, is dictionary with key=userportalId & value=downloadamount, get from database
    let stats = [];
    for (var key in designs) {
        stats.push(<div class="designdownloads">
                <div class="designdownloadstxt">
                    User Portal {key} <br/>
                    Aantal Downloads = {designs[key]}
                </div>
            </div>
        );
    }
    return stats;
}*/
