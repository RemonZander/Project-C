import logo from './logo.svg';
import './App.css';
import user_portal from './pages/user-portal/user-portal';
import LoginPage from './pages/login/login';
import ForgotPasswordPage from './pages/forgot password/forgot_pass';
import TemplateEngine from './pages/template-engine/templateEngine';
import ontwerp_pagina from './pages/ontwerp-pagina/ontwerp-pagina';

const pages = [LoginPage, ForgotPasswordPage, user_portal, TemplateEngine, ontwerp_pagina];

function App() {
    const pathName = window.location.pathname;

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

            return page.Render(queryParamsObject);
        }
    }

    return <h1>ERROR 404</h1>;
}

export default App;
