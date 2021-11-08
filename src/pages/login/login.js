import './login.css';
import kynda from './kynda.png';
import React, { useEffect, useState } from 'react';
import Alert from '../../components/Alert';

export default {
    url: '/',
    Render: (queryParams) => {
        const [isAuthError, setIsAuthError] = useState(false);

        return (
            <React.Fragment>
                <div className="errors">
                    {isAuthError === true && <Alert text="Login gegevens kloppen niet dum dum!" />}
                </div>
                <div className="center">
                    <img src={kynda} alt="Kynda logo" className="image"></img>
                    <h2>
                        {queryParams.adminPage
                            ? 'Log in op het admin-portaal'
                            : 'Log in op het klanten-portaal'}
                    </h2>
                    <form method="post" action="http://localhost:8080/auth">
                        <div className="txt_field">
                            <input type="text" id="email" name="email" required></input>
                            <label>Email</label>
                        </div>
                        <div className="txt_field">
                            <input type="password" id="password" name="password" required></input>
                            <label>Wachtwoord</label>
                        </div>
                        <input
                            type="submit"
                            value="Inloggen"
                            onClick={(e) => {
                                e.preventDefault();

                                const sessionEmail = sessionStorage.getItem('email');
                                const sessionPassword = sessionStorage.getItem('password');

                                if (sessionEmail !== null && sessionPassword !== null) {
                                    console.log('Not implemented yet');
                                } else {
                                    fetch('http://localhost:8080/auth', {
                                        method: 'POST',
                                        body: JSON.stringify({
                                            email: document.getElementById('email').value,
                                            password: document.getElementById('password').value,
                                        }),
                                    })
                                        .then((res) => res.json())
                                        .then((data) => {
                                            if ('auth' in data.content) {
                                                if (data.content.auth) {
                                                    sessionStorage.setItem(
                                                        'email',
                                                        document.getElementById('email').value
                                                    );
                                                    sessionStorage.setItem(
                                                        'password',
                                                        document.getElementById('password').value
                                                    );

                                                    data.content.isAdmin
                                                        ? (window.location.href =
                                                              window.location.href + 'admin-portal')
                                                        : (window.location.href =
                                                              window.location.href + 'user-portal');
                                                } else {
                                                    setIsAuthError(true);
                                                }
                                            } else {
                                                console.error(
                                                    'No auth. Request not made to auth url?'
                                                );
                                            }
                                        });
                                }
                            }}
                        ></input>
                        <div className="pass-adminlogin">
                            <a href="./forgot_password">Wachtwoord vergeten?</a>
                        </div>
                    </form>
                </div>
            </React.Fragment>
        );
    },
};

function emailValidation(e) {
    const message = document.getElementById('message');
    const showMessage = (el, cond) =>
        cond ? (el.style.display = 'block') : (el.style.display = 'none');
    if (e.target.value.length > 0) {
        message.style.display = 'block';
        showMessage(document.getElementById('emailApenstaartje'), e.target.value.indexOf('@') < 0);
        showMessage(document.getElementById('emailSpatie'), e.target.value.indexOf(' ') >= 0);
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
        showMessage(document.getElementById('passwordShort'), e.target.value.length < 8);
        showMessage(document.getElementById('passwordNoLower'), e.target.value.search(/[a-z]/) < 0);
        showMessage(document.getElementById('passwordNoUpper'), e.target.value.search(/[A-Z]/) < 0);
        showMessage(
            document.getElementById('passwordNoNumber'),
            e.target.value.search(/[0-9]/) < 0
        );
    } else {
        message.style.display = 'none';
    }
}
