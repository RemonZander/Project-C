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
        this.designDownloadList = { 6: 12, 8: 0, 21: 5 }; // get from database; is {templateId: amount of downloaded designs w this templateId}
    }
}

class EmployeeData {
    constructor(id, name) {
        this.id = id;
        this.name = name;
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
                                <div class="mainViewLeftUserList">
                                    <div
                                        class="mainViewLeftUserDataHeader"
                                        id="mainViewLeftUserDataHeader"
                                    >
                                        Geregistreerde gebruikers
                                    </div>
                                    <div
                                        class="mainViewLeftUserDataList"
                                        id="mainViewLeftUserDataList"
                                    ></div>
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
    const names = ['Henkje Geisterbrei', 'Sinter Klaas', 'Sietske Haarbal', 'Saskia Krentenbol', 'La Llrona', 'Brammetje Bakvet', 'Pauline Pisnicht', 'Merel Maagzuur'];
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
        console.log(userPortalList[listPos - 1]);
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
    document.getElementById('mainViewLeftUserDataList').innerHTML = FillUserDataList(pos);
    // continue making selection screen
}

function AddUserPortal() {
    // gives functionality to "User Portal Toevoegen" button; ID incrementally increases by 1
    let id = 'selector ' + (userPortalList.length + 1);
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
        )
    );
    userPortalDivList.push(temp.portalListDivs);
    userPortalList.push(temp);
}

function FillUserDataList(portalPos) {
    // fills the list of registered users in mainView
    console.log(userPortalList[portalPos]);
    let tempList = ``;
    for (let a = 0; a < userPortalList[portalPos].registeredEmployeeList.length; a++) {
        tempList =
            tempList +
            `
                <div class="userItemBox">
                    <div class="userItem">` +
            `ID: ` + userPortalList[portalPos].registeredEmployeeList[a].id + `<br />` +
            `Naam: ` + userPortalList[portalPos].registeredEmployeeList[a].name +
            `
                    </div>
                </div>`;
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
