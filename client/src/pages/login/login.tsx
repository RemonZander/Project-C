import './login.css';
import kynda from './kynda.png';
import React, { useEffect, useRef, useState } from 'react';
import { CreateExport } from '../../helpers/Export';
import { getPayloadAsJson, getToken, tokenExists } from '../../helpers/Token';
import { PageProps } from '../../@types/app';

function Login(props: PageProps) {
    const [isAuthError, setIsAuthError] = useState(false);
    const queryParams = props.queryParams;

    const emailInputRef = useRef(null);
    const passwordInputRef = useRef(null);

    if (tokenExists()) {
        const payload = getPayloadAsJson()!;

        payload.type === 'Admin'
            ? (window.location.href = window.location.href + 'admin-portal')
            : (window.location.href = window.location.href + 'user-portal');
    } else {
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
                            <input type="text" id="email" name="email" required ref={emailInputRef}></input>
                            <label>Email</label>
                        </div>
                        <div className="txt_field">
                            <input type="password" id="password" name="password" required ref={passwordInputRef}></input>
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

                                const email: HTMLInputElement | null = emailInputRef.current;
                                const psw: HTMLInputElement | null = passwordInputRef.current;

                                if (email !== null && psw !== null) {
                                    // Hier maken wij gebruik van de fetch method om een post request
                                    // te sturen naar de url die wordt meegegeven.
                                    // Voor meer informatie over fetch kan je naar deze url gaan
                                    // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
                                    fetch(process.env.REACT_APP_SERVER_URL + '/auth', {
                                        method: 'POST',
                                        body: JSON.stringify({
                                            email: (email as HTMLInputElement).value,
                                            password: (psw as HTMLInputElement).value,
                                        }),
                                    })
                                        .then((res) => res.json())
                                        .then((data) => {
                                            if (
                                                'token' in data.content &&
                                                data.content.token !== null
                                            ) {
                                                document.cookie = 'token=' + data.content.token + ';';

                                                const payload = JSON.parse(
                                                    Buffer.from(
                                                        data.content.token.split('.')[1],
                                                        'base64'
                                                    ).toString()
                                                );

                                                payload.type === 'Admin'
                                                    ? (window.location.href =
                                                            window.location.href + 'admin-portal')
                                                    : (window.location.href =
                                                            window.location.href + 'user-portal');
                                            } else {
                                                setIsAuthError(true);
                                            }
                                        });
                                    }
                                }
                            }

                        ></input>
                        <div className="pass-adminlogin">
                            <a href="./forgot_password">Wachtwoord vergeten?</a>
                        </div>
                    </form>
                </div>
            </React.Fragment>
        );
    }
}

export default CreateExport('/', Login, false, []);
