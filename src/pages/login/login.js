import './login.css';
import kynda from './kynda.png';

export default {
    url: '/',
    Render: (queryParams) => {
        return (
            <div className="center">
                <img src={kynda} alt="Kynda logo" className="image"></img>
                <h2>Log hier in op het klant-portal</h2>
                <form method="post">
                    <div className="txt_field">
                        <input type="text" required></input>
                        <span></span>
                        <label>Email</label>
                    </div>
                    <div className="txt_field">
                        <input type="password" required></input>
                        <span></span>
                        <label>Wachtwoord</label>
                    </div>
                    <input type="submit" value="Inloggen"></input>
                    <div className="pass-adminlogin">
                        <div className="pass">Wachtwoord vergeten?</div>
                        <div className="adminlogin_link">
                            Zoekt u het admin-portal?
                        </div>
                    </div>
                </form>
            </div>
        );
    },
};
