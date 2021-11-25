import './fotolibrary-pagina.css';
import { Typography } from '@material-ui/core';
import kyndalogo from './kynda.png';
import settingslogo from './tandwiel.png';
import { useState } from 'react';
import voorbeeld1 from './voorbeeld1.jpg';
import voorbeeld2 from './voorbeeld2.jpg';
import voorbeeld3 from './voorbeeld3.jpg';
import voorbeeld4 from './voorbeeld4.jpg';
import voorbeeld5 from './voorbeeld5.jpg';
import voorbeeld6 from './voorbeeld6.jpg';
import { CreateExport } from '../../helpers/Export';

function Gallery() {
    const [isAdmin] = useState(true);
    let fotoStorage = [voorbeeld1, voorbeeld2, voorbeeld3, voorbeeld4, voorbeeld5, voorbeeld6];
    return (
        <div>
            <div class="menubar">
                <div class="kyndalogo">
                    <img src={kyndalogo} alt="kynda logo" width="120" height="40"></img>
                </div>
                <div class="fotogalerijHeader">Fotogalerij</div>
                <div class="adminButton">{adminButton(isAdmin)}</div>
                <div class="searchbar">
                    <input type="text" placeholder="Zoeken..."></input>
                </div>
                <div class="logoutbutton">
                    <loguitbutton>Uitloggen</loguitbutton>
                </div>

                <div class="kyndacog">
                    <img src={settingslogo} alt="settings" width="39" height="39"></img>
                </div>
            </div>

            <div class="gallerySpace">
                <div class="fotogallery">{fotolibrary(fotoStorage, isAdmin)}</div>
            </div>
        </div>
    );
}

export default CreateExport('/fotogalerij', Gallery);

function imageOnHover(id) {
    const imgId = 'img' + id;
    const buttonId = 'btn' + id;
    document.getElementById(imgId).style.filter = 'blur(4px)';
    document.getElementById(imgId).style.transition = '1s';
    document.getElementById(buttonId).style.display = 'block';
    document.getElementById(buttonId).style.opacity = '1';
    document.getElementById(buttonId).style.top =
        String(document.getElementById(imgId).height / 1.5) + 'px';
    document.getElementById(buttonId).style.left =
        String(document.getElementById(imgId).width / 7) + 'px';
}

function imageLeave(id) {
    const imgId = 'img' + id;
    const buttonId = 'btn' + id;
    document.getElementById(imgId).style.filter = 'none';
    document.getElementById(buttonId).style.opacity = '0';
}

function selectedPicture(picture, type) {
    picture.preventDefault();
    if (type === 'select') {
        alert('Uw foto is geselecteerd!');
    } else if (type === 'add') {
        alert('Hier kan u fotos toevoegen');
        //foto toevoegen
    } else {
        alert('De geselecteerde foto is verwijderd!');
    }
}

function adminButton(isAdmin) {
    if (isAdmin) {
        return (
            <button type="button" onClick={(e) => selectedPicture(e, 'add')}>
                Foto's toevoegen
            </button>
        );
    }
}

function deleteButton(isAdmin) {
    if (isAdmin) {
        const buttonStyle = { backgroundColor: 'red', border: 'solid red' };
        return buttonStyle;
    } else {
        const buttonStyle = { backgroundColor: 'blue' };
        return buttonStyle;
    }
}

function fotolibrary(fotoStorage, isAdmin) {
    let fotolibrary = [];

    for (let a = 1; a <= fotoStorage.length; a++) {
        fotolibrary.push(
            <div class="picture">
                <h3>naam van foto</h3>
                <button
                    id={'btn' + a}
                    type="button"
                    style={deleteButton(isAdmin)}
                    onMouseEnter={() => imageOnHover(a)}
                    onMouseLeave={() => imageLeave(a)}
                    onClick={(e) => selectedPicture(e, isAdmin ? 'delete' : 'select')}
                >
                    {isAdmin ? 'Verwijderen' : 'Selecteren'}
                </button>
                <img
                    id={'img' + a}
                    onMouseEnter={() => imageOnHover(a)}
                    onMouseLeave={() => imageLeave(a)}
                    src={fotoStorage[a - 1]}
                    alt="fotolibrary"
                ></img>
            </div>
        );
    }
    return fotolibrary;
}
