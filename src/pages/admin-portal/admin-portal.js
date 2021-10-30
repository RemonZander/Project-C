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
                    </div>
                    <div class="userportallist">{userportals()}</div> 
                </div>
            </React.Fragment>
        );
    },
};

function userportals() {
    // function to generate user-portal list-view
    let list = [];
    let amount = 10; // temp value, should be amount of user-portals, get from database
    for (let a = 1; a <= amount; a++) {
        list.push(<div class="userportalitembox">
            <div class="userportalitem">
                {getuserportalid(a)} <br/>
                {getuserportalcompany()}
            </div>
        </div>);
    }
    return list;
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