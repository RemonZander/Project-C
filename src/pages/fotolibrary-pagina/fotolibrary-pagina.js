import './fotolibrary-pagina.css';
import kyndalogo from './kynda.png';
import settingslogo from './tandwiel.png';

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

                <div class="gallery">
                    <div>
                        <div class="fotolist">{fotolibrary()}</div>
                    </div>
                </div>
            </div>
        );
    },
};

function fotolibrary() {
    let list = [];
    let max = 5;
    for (let a = 0; a < max; a++) {
        list.push(<div class="foto"></div>);
    }
    if (max == 5) {
        list.push(<button type="button">Meer foto's</button>);
    }
    return list;
}
