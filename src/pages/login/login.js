import './login.css';
import kynda from './kynda.png';
import { doc } from 'prettier';
import { useState } from 'react';

export default {
    url: '/',
    Render: (queryParams) => {
        const [isAdminPortal, setIsAdminPortal] = useState(false);
        const array = [
            <p id="passwordShort">U wachtwoord is te kort</p>,
            <p id="passwordNoLower">U wachtwoord bevat geen kleine letter</p>,
            <p id="passwordNoUpper">U wachtwoord bevat geen hoofdletter</p>,
            <p id="passwordNoNumber">U wachtwoord bevat geen cijfer</p>,
            <p id="emailApenstaartje">Uw email bevat geen apenstaartje</p>,
            <p id="emailSpatie">Uw email bevat een spatie</p>,
        ];
        return (
            <div className="center">
                <img src={kynda} alt="Kynda logo" className="image"></img>
                <h2>
                    {isAdminPortal
                        ? 'Log in op uw admin-portaal'
                        : 'Log in op uw klanten-portaal'}
                </h2>
                <form method="post">
                    <div className="txt_field">
                        <input
                            type="text"
                            onInput={(e) => emailValidation(e)}
                            id="email"
                            required
                        ></input>
                        <span></span>
                        <label>Email</label>
                    </div>
                    <div className="txt_field">
                        <input
                            type="password"
                            onInput={(e) => passwordValidation(e)}
                            id="wachtwoord"
                            required
                        ></input>
                        <span></span>
                        <label>
                            Wachtwoord (min. 8 tekens, 1 hoofdletter, 1
                            kleineletter, 1 cijfer)
                        </label>
                    </div>
                    <div id="message" className="message">
                        {array}
                    </div>
                    <input
                        type="submit"
                        onClick={(e) => loginSubmitValidation(e)}
                        value="Inloggen"
                    ></input>
                    <div className="pass-adminlogin">
                        <a href="./forgot_password">Wachtwoord vergeten?</a>
                        <a
                            href="/"
                            className="adminlogin_link"
                            onClick={(e) => {
                                e.preventDefault();
                                setIsAdminPortal(!isAdminPortal);
                            }}
                        >
                            {isAdminPortal
                                ? 'Zoekt u naar het klanten-portal?'
                                : 'Zoekt u het admin-portal?'}
                        </a>
                    </div>
                </form>
            </div>
        );
    },
};

function emailValidation(e) {
    const message = document.getElementById('message');
    const showMessage = (el, cond) =>
        cond ? (el.style.display = 'block') : (el.style.display = 'none');
    if (e.target.value.length > 0) {
        message.style.display = 'block';
        showMessage(
            document.getElementById('emailApenstaartje'),
            e.target.value.indexOf('@') < 0
        );
        showMessage(
            document.getElementById('emailSpatie'),
            e.target.value.indexOf(' ') >= 0
        );
    } else {
        message.style.display = 'none';
    }
}

function passwordValidation(e) {
    const message = document.getElementById('message');
    const showMessage = (el, cond) =>
        cond ? (el.style.display = 'block') : (el.style.display = 'none');
    if (e.target.value.length > 0) {
        message.style.display = 'block';
        showMessage(
            document.getElementById('passwordShort'),
            e.target.value.length < 8
        );
        showMessage(
            document.getElementById('passwordNoLower'),
            e.target.value.search(/[a-z]/) < 0
        );
        showMessage(
            document.getElementById('passwordNoUpper'),
            e.target.value.search(/[A-Z]/) < 0
        );
        showMessage(
            document.getElementById('passwordNoNumber'),
            e.target.value.search(/[0-9]/) < 0
        );
    } else {
        message.style.display = 'none';
    }
}

function loginSubmitValidation(e) {
    e.preventDefault();
    const errorMessages = document.querySelectorAll('.message > p');
    for (let i = 0; i < errorMessages.length; i++) {
        const element = errorMessages[i];
        if (element.style.display === 'block') {
            alert('De eisen voor uw email of wachtwoord zijn nog niet voldaan');
            return;
        }
    }
    console.log('Eisen zijn voldaan.');
}
