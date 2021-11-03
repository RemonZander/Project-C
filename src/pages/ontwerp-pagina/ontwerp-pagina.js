import * as React from 'react';
import './ontwerp-pagina.css';
import kyndaletter from './kyndaletter.png';
import cog from './cog69420.png';
import kleurletterknop from './kleurletterknop.PNG';
import pijllinks from './pijllinks.PNG';
import pijlrechts from './pijlrechts.png';

export default {
    url: '/desinger',
    Render: (queryParams) => {
        return (
            <React.Fragment>
                <div className="menubar">
                    <div className="kyndalogo">
                        <img src={kyndaletter} width="104" height="55" />
                    </div>
                    <div className="klantenportaalHeader">Design portal</div>
                    <div className="dropdown">
                        <label for="menu"> Opties: </label>
                        <select name="menu" id="menu">
                            <option value="optie1">optie1</option>
                            <option value="optie2">optie2</option>
                            <option value="optie3">optie3</option>
                            <option value="optie4">optie4</option>
                        </select>
                    </div>
                    <div className="logoutbutton">
                        <loguitbutton>Uitloggen</loguitbutton>
                    </div>
                    <div className="kyndacog">
                        <img src={cog} width="40" height="40" />
                    </div>
                </div>
                <div className="optiebar">
                    <button
                        className="bewerkopties"
                        onClick={() => bewerkopties('bestand')}
                    >
                        Bestand
                    </button>
                    <button
                        className="bewerkopties"
                        onClick={() => bewerkopties('start')}
                    >
                        Start
                    </button>
                    <button
                        className="bewerkopties"
                        onClick={() => bewerkopties('invoegen')}
                    >
                        Invoegen
                    </button>
                </div>
                <div id="message" className="optionmenu">
                    {optiemenuarray}
                </div>

                <div className="designpage">
                    <img
                        className="pijlen"
                        src={pijllinks}
                        width="100"
                        height="44"
                    />
                    <div
                        className="innerdesignpage"
                        onClick={() => bewerkoptiessluiten()}
                    >
                        <iframe
                            id="templatepage1"
                            className="templatepage"
                        ></iframe>
                        <iframe
                            id="templatepage2"
                            className="templatepage"
                        ></iframe>
                    </div>
                    <img
                        className="pijlen"
                        src={pijlrechts}
                        width="100"
                        height="44"
                    />
                </div>
            </React.Fragment>
        );
    },
};

function bewerkopties(choice) {
    const message = document.getElementById('message');
    if (
        (message.style.display == 'block' &&
            (choice == 'bestand') &
                (document.getElementById('bestandoptiemenu').style.display ==
                    'flex')) ||
        (choice == 'start') &
            (document.getElementById('startoptiemenu').style.display ==
                'flex') ||
        (choice == 'invoegen') &
            (document.getElementById('invoegenoptiemenu').style.display ==
                'flex')
    ) {
        bewerkoptiessluiten();
        return;
    }
    message.style.display = 'block';
    document.getElementById('templatepage1').style.width = '459px';
    document.getElementById('templatepage1').style.height = '650px';
    document.getElementById('templatepage2').style.width = '459px';
    document.getElementById('templatepage2').style.height = '650px';
    if (choice == 'bestand') {
        document.getElementById('bestandoptiemenu').style.display = 'flex';
        document.getElementById('startoptiemenu').style.display = 'none';
        document.getElementById('invoegenoptiemenu').style.display = 'none';
    } else if (choice == 'start') {
        document.getElementById('bestandoptiemenu').style.display = 'none';
        document.getElementById('startoptiemenu').style.display = 'flex';
        document.getElementById('invoegenoptiemenu').style.display = 'none';
    } else {
        document.getElementById('invoegenoptiemenu').style.display = 'flex';
        document.getElementById('startoptiemenu').style.display = 'none';
        document.getElementById('bestandoptiemenu').style.display = 'none';
    }
}

function bewerkoptiessluiten() {
    const message = document.getElementById('message');
    message.style.display = 'none';
    document.getElementById('bestandoptiemenu').style.display = 'none';
    document.getElementById('startoptiemenu').style.display = 'none';
    document.getElementById('invoegenoptiemenu').style.display = 'none';
    document.getElementById('templatepage1').style.width = '495px';
    document.getElementById('templatepage1').style.height = '700px';
    document.getElementById('templatepage2').style.width = '495px';
    document.getElementById('templatepage2').style.height = '700px';
}

const optiemenuarray = [
    <div id="bestandoptiemenu" className="bestandoptiemenu">
        <div>
            <button className="butttongeneral">Nieuw design</button>
            <br />
            <button className="butttongeneral">Open design</button>
        </div>
        <div>
            <button className="butttongeneral">Design opslaan</button>
            <br />
            <button className="butttongeneral">Design afdrukken</button>
        </div>
        <button className="butttongenerallast">Desinger afsluiten</button>
    </div>,
    <div id="startoptiemenu" className="startoptiemenu">
        <div className="lettertype">
            <div className="flex">
                <label for="lettertypekeuze"> Lettertype: </label>
                <select name="lettertypekeuze" id="lettertypekeuze">
                    <option value="lettertype1">lettertype1</option>
                    <option value="lettertype2">lettertype2</option>
                    <option value="lettertype3">lettertype3</option>
                    <option value="lettertype4">lettertype4</option>
                </select>
                <label
                    for="lettertypegrootte"
                    className="lettertypegrootte"
                ></label>
                <select name="lettertypegrootte" id="lettertypegrootte">
                    <option value="10">10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                    <option value="13">13</option>
                </select>
                <button className="butttongeneralsmall">A^</button>
                <button className="butttongeneralsmall">a˅</button>
                <h3 className="devider">|</h3>
            </div>
            <div className="flex">
                <button
                    className="butttongeneralsmall"
                    style={{ fontWeight: 'bold' }}
                >
                    B
                </button>
                <button
                    className="butttongeneralsmall"
                    style={{ fontStyle: 'italic' }}
                >
                    i
                </button>
                <button
                    className="butttongeneralsmall"
                    style={{ textDecorationLine: 'underline' }}
                >
                    U
                </button>
                <h3 className="devider">|</h3>
                <button className="butttongeneralsmall">
                    <img src={kleurletterknop} width="16" height="14" />
                </button>
            </div>
        </div>
    </div>,
    <div id="invoegenoptiemenu" className="invoegenoptiemenu">
        Nog voor mogelijke invoeg opties
    </div>,
];
