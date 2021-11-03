import * as React from 'react';
import './admin-portal.css'
import kyndaletter from './kyndaletter.png';
import cog from './cog69420.png';

export default {
    url: '/admin-portal',
    Render: (queryParams) => {
        return (
            <React.Fragment>
                {/* menubar bijna tzelfde als die in user-portal.js */}
                <div class="menubarAdmin">
                    <div class="kyndalogo">  
                        <img src={kyndaletter} width="104" height="55" />
                    </div>
                    <div class="adminportalHeader">Adminportaal</div>
                    <div class="dropdown">
                        <label for="menu"> Opties: </label>
                        <select name="menu" id="menu">
                            <option value="optie1">optie1</option>
                            <option value="optie2">optie2</option>
                            <option value="optie3">optie3</option>
                            <option value="optie4">optie4</option>
                        </select>
                    </div>
                    <div class="logoutbutton">
                        <loguitbutton>Uitloggen</loguitbutton>
                    </div>
                    <div class="kyndacog">
                        <img src={cog} width="40" height="40" />
                    </div>
                </div>

                <div class="mainpage">
                    <div class="listviewtxtbox"> 
                        <p class="listviewtxt">User Portals</p>
                        <p class="downloadsviewtxt">Downloadstatistieken</p>
                    </div>
                    <div class="midsection">
                        <div class="userportallist">{drawuserportals()}</div>
                        <div class="downloadstatistics">
                            <div class="templatedownloadsbox">
                                <div class="statheader">Templates</div>
                                {drawstatisticstemplates()}
                            </div>
                            <div class="designdownloadsbox">
                                <div class="statheader">Designs</div>
                                {drawstatisticsdesigns()}
                            </div>
                        </div> 
                    </div>
                    <div class="listviewtxtbox">
                        <p class="adduserportalbutton">User Portal Toevoegen</p>
                    </div>
                </div>
            </React.Fragment>
        );
    },
};

function drawuserportals() {
    // function to generate user-portal list-view
    window.userportallist = [];
    window.userportalamount = 10; // temp value, should be amount of user-portals, get from database
    for (window.listpos = 1; window.listpos <= window.userportalamount; window.listpos++) {
        window.userportallist.push(<div class="userportalitembox">
            <div class="userportalitem">
                {getuserportalid(window.listpos)} <br/>
                {getuserportalcompany()}
                <div class="fotolibraryaccessbutton">Open Fotolibrary</div>
                <div class="deletebutton" onClick={removeuserportal(window.listpos, window.userportallist)}>Delete</div>
            </div>
        </div>);
    }
    return window.userportallist;
}

function getuserportalid(listpos) {
    // for filling the individual user-portal boxes with actual info
    // update later to get the user-portal internal id, so company name (& maybe logo) can be retrieved
    let id = "User Portal " + listpos;
    return id;
}

function getuserportalcompany() {
    // use internal user-portal id to get company name (& maybe logo but idk)
    let companyname = "Temporary Intelligence Incorporated" // temp value, should be the corporation name, get from database
    return companyname
}

function removeuserportal(listpos, list) {
    delete list[listpos];
    return list;
}

function adduserportal() {
    window.userportalamount++;
    window.userportallist.push(<div class="userportalitembox">
        <div class="userportalitem">
            {getuserportalid(window.userportalamount)} <br/>
            {getuserportalcompany()}
            <div class="fotolibraryaccessbutton">Open Fotolibrary</div>
            <div class="deletebutton" onClick={removeuserportal(window.userportalamount, window.userportallist)}>Delete</div>
        </div>
    </div>);
    return window.userportallist;
}

function drawstatisticstemplates() {
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
}