import * as React from 'react';
import './admin-portal.css'
import kyndaLetter from './kyndaletter.png';
import cog from './cog69420.png';

let userPortalList = [];
DrawUserPortals();

export default {
    url: '/admin-portal',
    Render: (queryParams) => {
        const [userPortalList1, SetUserPortalList] = React.useState([]);
        
        
        React.useEffect(() => {
            
        }) 
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
                        {/*<p class="downloadsviewtxt">Downloadstatistieken</p>*/}
                    </div>
                    <div class="midSection">
                        <div class="userPortalList" id="userPortalList">{userPortalList}</div>
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
                        <p class="addUserPortalButton" onClick={() => SetUserPortalList(AddUserPortal())}>User Portal Toevoegen</p>
                    </div>
                </div>
            </React.Fragment>
        );
    },
};

function DrawUserPortals() {
    // function to generate user-portal list-view
    
    let userPortalAmount = 10; // temp value, should be amount of user-portals, get from database
    for (let listPos = 1; listPos <= userPortalAmount; listPos++) {
        userPortalList.push(<div class="userPortalItemBox">
            <div class="userPortalItem">
                {GetUserPortalId(listPos)} <br/>
                {GetUserPortalCompany()}
                <div class="selectUserPortalButton">Selecteren</div>
            </div>
        </div>);
    }
}

function GetUserPortalId(listPos) {
    // for filling the individual user-portal boxes with actual info
    // update later to get the user-portal internal id, so company name (& maybe logo) can be retrieved
    let id = "User Portal " + listPos;
    return id;
}

function GetUserPortalCompany() {
    // use internal user-portal id to get company name (& maybe logo but idk)
    let companyname = "Temporary Intelligence Incorporated" // temp value, should be the corporation name, get from database
    return companyname
}

/*function removeuserportal(listPos, list) {
    delete list[listPos];
    return list;
}*/

function AddUserPortal() {
    userPortalList.push(<div class="userPortalItemBox">
        <div class="userPortalItem">
            {GetUserPortalId(69420 /* change l8er */)} <br/>
            {GetUserPortalCompany()}
            <div class="selectUserPortalButton">Selecteren</div>
        </div>
    </div>);
    console.log(userPortalList);
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