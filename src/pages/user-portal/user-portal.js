import * as React from 'react';
import './user-portal.css';

export default {
    url: '/user-portal',
    render: (queryParams) => {
        return (
            <React.Fragment>
            <div class="menubar">
                <div class="kyndalogo">
                    <image src="kyndaletter.png" width="104" height="55"/>
                </div>
                <div class="klantenportaalHeader">
                    Klantenportaal
                </div>
                <div class="dropdown">
                    <label for="menu">Geen idee:</label>
                    <select name="menu" id="menu">
                        <option value="optie1">optie1</option>
                        <option value="optie2">optie2</option>
                        <option value="optie3" selected>optie3</option>
                        <option value="optie4">optie4</option>
                    </select>
                </div>
                <div class="logoutbutton">
                    <loguitbutton>Uitloggen</loguitbutton>
                </div>
          
                <div class="kyndacog">
                    <image src="cog69420.png" width="40" height="40"/>   
                </div>
            </div>

            <div class="mainpage">
                <div>
                    <p class="recent">Recente designs</p>
                    <div class="itemlist">
                        <div class="item"></div>
                        <div class="item"></div>
                        <div class="item"></div>
                    </div>
                </div>
                <div>
                    <p class="recent">Recente foto's</p>
                    <div class="itemlist">
                        <div class="item"></div>
                        <div class="item"></div>
                        <div class="item"></div>
                    </div>
                </div>
            </div>
            </React.Fragment>
        );
    },
};