import './App.css';
import user_portal from './pages/user-portal/user-portal';
import admin_portal from './pages/admin-portal/admin-portal';
import LoginPage from './pages/login/login';
import TemplateEngine from './pages/template-engine/templateEngine';
import { useEffect, useState } from 'react';
import fotolibraryPagina from './pages/fotolibrary-pagina/fotolibrary-pagina';
import { ICreateObject } from './@types/app';
import { getToken } from './helpers/Token';
import ErrorPage from './components/ErrorPage';

const pages: Array<ICreateObject> = [
    LoginPage,
    user_portal,
    admin_portal,
    TemplateEngine,
    fotolibraryPagina,
];

function App() {
    const pathName = window.location.pathname;

    const [isUserAuth, setIsUserAuth] = useState<boolean>(false);
    const [userType, setUserType] = useState<string | null>(null);

    useEffect(() => {
        const token = getToken();

        if (token !== undefined) {
            fetch(process.env.REACT_APP_SERVER_URL + '/api/auth', {
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
            let queryParamsObject: {[key: string]: string | boolean | number} = {};

            if (queryParamsString !== '') {
                const params = queryParamsString.slice(1, queryParamsString.length).split('&');

                for (let i = 0; i < params.length; i++) {
                    const param = params[i];

                    const sepIndex = param.indexOf('=');

                    const key: string = param.slice(0, sepIndex);
                    let val: string | boolean | number = param.slice(sepIndex + 1, param.length);

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

            if (page.auth) {
                if (isUserAuth && userType !== null && page.allowedUsers.includes(userType)) {
                    return <page.component queryParams={queryParamsObject} />;
                } else {
                    return <ErrorPage error={403} />;
                }
            } else {
                return <page.component queryParams={queryParamsObject} />;
            }
        }
    }

    return <ErrorPage error={404}/>;
}

export default App;
