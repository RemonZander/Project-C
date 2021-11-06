import './fotolibrary-pagina.css';
import kyndalogo from './kynda.png';
import settingslogo from './tandwiel.png';
import voorbeeld1 from './voorbeeld1.jpg';
import voorbeeld2 from './voorbeeld2.jpg';
import voorbeeld3 from './voorbeeld3.jpg';
import voorbeeld4 from './voorbeeld4.jpg';
import voorbeeld5 from './voorbeeld5.jpg';
import voorbeeld6 from './voorbeeld6.jpg';

export default {
    url: '/fotogalerij',
    Render: (queryParams) => {
        return (
            <div>
                <div class="menubar">
                    <div class="kyndalogo">
                        <img src={kyndalogo} width="120" height="40"></img>
                    </div>
                    <div class="fotogalerijHeader">Fotogalerij</div>
                    <div class="searchbar">
                        <input type="text" placeholder="Zoeken..."></input>
                    </div>
                    <div class="logoutbutton">
                        <loguitbutton>Uitloggen</loguitbutton>
                    </div>

                    <div class="kyndacog">
                        <img src={settingslogo} width="39" height="39"></img>
                    </div>
                </div>

                <div class="gallerySpace">
                    <div>
                        <div class="fotolist">{fotolibrary()}</div>
                    </div>
                </div>
            </div>
        );
    },
};

function fotolibrary() {
    let fotolibrary = [
        <div class="fotogallery">
            <img src={voorbeeld1} height="374"></img>
            <img src={voorbeeld2} height="329"></img>
            <img src={voorbeeld3} height="244"></img>
            <img src={voorbeeld4} height="260"></img>
            <img src={voorbeeld5} height="333"></img>
            <img src={voorbeeld6} height="357"></img>
        </div>,
    ];

    //Beginnetje van een functie om foto's zelf toe te voegen als admin:

    // const maxFotosPerLine = 3;
    // for (let foto = 0; foto < maxFotosPerLine; foto++) {
    //     list.push(<div class="foto"></div>);
    //     if (foto == maxFotosPerLine) {
    //         list.push(<br></br>)
    //     }
    // }

    return fotolibrary;
}
