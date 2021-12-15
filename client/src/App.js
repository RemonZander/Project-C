import './App.css';
import user_portal from './pages/user-portal/user-portal';
import user_portal_settings from './pages/user-portal/user-portal-settings';
import admin_portal from './pages/admin-portal/admin-portal';
import LoginPage from './pages/login/login';
import ForgotPasswordPage from './pages/forgot password/forgot_pass';
import TemplateEngine from './pages/template-engine/templateEngine';
import ontwerp_pagina from './pages/ontwerp-pagina/ontwerp-pagina';
import { useEffect, useState } from 'react';
import fotolibraryPagina from './pages/fotolibrary-pagina/fotolibrary-pagina';

const pages = [
    LoginPage,
    ForgotPasswordPage,
    user_portal,
    admin_portal,
    TemplateEngine,
    ontwerp_pagina,
    fotolibraryPagina,
    user_portal_settings,
];

function App() {
    const pathName = window.location.pathname;

    const [isUserAuth, setIsUserAuth] = useState(null);
    const [userType, setUserType] = useState(null);

    useEffect(() => {
        const cookieString = document.cookie;

        if (cookieString !== '') {
            const token = cookieString
                .split(';')
                .find((row) => row.startsWith('token='))
                .split('=')[1];

            fetch(process.env.REACT_APP_SERVER_URL + '/auth', {
                method: 'GET',
                headers: { Authorization: 'Bear ' + token },
            })
                .then((res) => res.json())
                .then((data) => {
                    const payload = JSON.parse(
                        Buffer.from(data.content.token.split('.')[1], 'base64').toString()
                    );

                    if (token === data.content.token) {
                        setIsUserAuth(true);
                        setUserType(payload.type);
                    }
                })
                .catch((err) => console.error(err));
        }
    }, [isUserAuth, userType]);

    for (let i = 0; i < pages.length; i++) {
        const page = pages[i];

        if (pathName === page.url) {
            let queryParamsString = window.location.search;
            let queryParamsObject = {};

            if (queryParamsString !== '') {
                const params = queryParamsString.slice(1, queryParamsString.length).split('&');

                for (let i = 0; i < params.length; i++) {
                    const param = params[i];

                    const sepIndex = param.indexOf('=');

                    const key = param.slice(0, sepIndex);
                    let val = param.slice(sepIndex + 1, param.length);

                    const possibleNumber = parseInt(val, 10);

                    if (val.toLowerCase() === 'true') {
                        val = true;
                    } else if (val.toLowerCase() === 'false') {
                        val = false;
                    } else if (isNaN(possibleNumber)) {
                        val = possibleNumber;
                    }

                    queryParamsObject[key] = val;
                }
            }

            const isLoaded = isUserAuth !== null && userType !== null;

            if (page.auth) {
                if (!isLoaded) {
                    return null;
                } else if (isUserAuth && page.allowedUsers.includes(userType)) {
                    return <page.component queryParams={queryParamsObject} />;
                } else {
                    return <h1>403 Not Authorized</h1>;
                }
            } else {
                return <page.component queryParams={queryParamsObject} />;
            }
        }
    }

    return <h1>ERROR 404</h1>;
}

export default App;
