import { CreateExport } from '../../helpers/Export';
import './forgot_pass.css';
import kynda from './kynda.png';

function ForgotPassword() {
    return (
        <div className="center">
            <img src={kynda} alt="Kynda logo" className="image"></img>
            <h2>Geef hier uw e-mail op</h2>
            <form method="post">
                <div className="txt_field">
                    <input type="text" required></input>
                    <span></span>
                    <label>Email</label>
                </div>
                <input type="submit" value="Verstuur"></input>
            </form>
        </div>
    );
}
export default CreateExport('/forgot_password', ForgotPassword, false, []);
