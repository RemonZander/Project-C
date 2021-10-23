import * as React from 'react';
import './user-portal.css';
import kyndaletter from './kyndaletter.png';
import cog from './cog69420.png';
import plus from './plusafbeelding.png';

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

//Functie voor het aantal vakjes voor design preview. Dit gaat nog verder aangepast worden wanneer het systeem meer opgezet is
//Er mogen max 5 vakjes zijn + vakje voor alle designs + plus teken
function designs() {
    // function om design-vakjes aantal te tekenen; current = 5
    let list = [];
    let max = 5; // temp variable
    for (let a = 0; a < max; a++) {
        list.push(<div class="item"></div>);
    }
    if (max >= 5) {
        list.push(<div class="lastitem"> Alle designs </div>);
    }
    list.push(
        <img class="plusimage" src={plus} width="130" height="130"></img>
    );
    return list;
}

//Functie voor het aantal vakjes voor foto preview. Dit gaat nog verder aangepast worden wanneer het systeem meer opgezet is
//Er mogen max 5 vakjes zijn + vakje voor alle foto's + plus teken
function fotos() {
    let list = [];
    let max = 4; // temp variable
    for (let a = 0; a < max; a++) {
        list.push(<div class="item"></div>);
    }
    if (max >= 5) {
        list.push(<div class="lastitem"> Alle foto's </div>);
    }
    list.push(
        <img class="plusimage" src={plus} width="130" height="130"></img>
    );
    return list;
}
