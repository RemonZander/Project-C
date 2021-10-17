import * as React from 'react';
import './user-portal.css';
import kyndaletter from './kyndaletter.png';
import cog from './cog69420.png';
import plus from './plus afbeelding.png';

export default {
    url: '/user-portal',
    render: (queryParams) => {
        return (
            <React.Fragment>
                <div class="menubar">
                    <div class="kyndalogo">
                        <img src={kyndaletter} width="104" height="55" />
                    </div>
                    <div class="klantenportaalHeader">Klantenportaal</div>
                    <div class="dropdown">
                        <label for="menu">Geen idee: </label>
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
                    <div>
                        <p class="recent">Recente designs</p>
                        <div class="itemlist">{designs()}</div>
                    </div>
                    <div>
                        <p class="recent">Recente foto's</p>
                        <div class="itemlist">{fotos()}</div>
                    </div>
                </div>
            </React.Fragment>
        );
    },
};

function designs() {
    let list = [];
    for (let a = 0; a < 5; a++) {
        list.push(<div class="item"></div>);
    }
    return list;
}

function fotos() {
    let list = [];
    for (let a = 0; a < 5; a++) {
        list.push(<div class="item"></div>);
    }

    return list;
}
