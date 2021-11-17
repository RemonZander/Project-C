import './login.css';
import kynda from './kynda.png';
import React, { useEffect, useState } from 'react';
import Alert from '../../components/Alert';

export default {
    url: '/',
    auth: false,
    adminOnly: false,
    Render: (queryParams) => {
        const [isAuthError, setIsAuthError] = useState(false);

        return (
            <React.Fragment>
                <div className="center">
                    <img src={kynda} alt="Kynda logo" className="image"></img>
                    <h2>
                        {queryParams.adminPage
                            ? 'Log in op het admin-portaal'
                            : 'Log in op het klanten-portaal'}
                    </h2>
                    <form method="post">
                        <div className="txt_field">
                            <input type="text" id="email" name="email" required></input>
                            <label>Email</label>
                        </div>
                        <div className="txt_field">
                            <input type="password" id="password" name="password" required></input>
                            <label>Wachtwoord</label>
                        </div>
                        <div className="Errormsg">
                            {isAuthError === true && 'Uw login gegevens kloppen niet!'}
                        </div>
                        <input
                            type="submit"
                            value="Inloggen"
                            onClick={(e) => {
                                e.preventDefault();

                                // Hier maken wij gebruik van de fetch method om een post request
                                // te sturen naar de url die wordt meegegeven.
                                // Voor meer informatie over fetch kan je naar deze url gaan
                                // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
                                fetch(process.env.REACT_APP_SERVER_URL + '/auth', {
                                    method: 'POST',
                                    body: JSON.stringify({
                                        email: document.getElementById('email').value,
                                        password: document.getElementById('password').value,
                                    }),
                                })
                                    .then((res) => res.json())
                                    .then((data) => {
                                        if ('token' in data.content && data.content.token !== null) {
                                            document.cookie = "token=" + data.content.token + ";";

                                            const payload = JSON.parse(Buffer.from(data.content.token.split('.')[1], 'base64').toString());

                                            payload.admin
                                                ? (window.location.href =
                                                    window.location.href + 'admin-portal')
                                                : (window.location.href =
                                                    window.location.href + 'user-portal');
                                        } else {
                                            setIsAuthError(true);
                                        }
                                    });
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
