import logo from './logo.svg';
import './App.css';
import Example1Page from './pages/example1/example1';
import Example2Page from './pages/example2/example2';
import user_portal from './pages/user-portal/user-portal';
import LoginPage from './pages/login/login';
import ForgotPasswordPage from './pages/forgot password/forgot_pass';
import TemplateEngine from './pages/template-engine/templateEngine';
import ontwerp_pagina from './pages/ontwerp-pagina/ontwerp-pagina';

const pages = [
    Example1Page,
    Example2Page,
    LoginPage,
    ForgotPasswordPage,
    user_portal,
    TemplateEngine,
    ontwerp_pagina,
];

function App() {
    const pathName = window.location.pathname;

    for (let i = 0; i < pages.length; i++) {
        const page = pages[i];

        if (pathName === page.url) {
            let queryParamsString = window.location.search;
            let queryParamsObject = {};

            if (queryParamsString !== '') {
                const params = queryParamsString
                    .slice(1, queryParamsString.length)
                    .split('&');

                for (let i = 0; i < params.length; i++) {
                    const param = params[i];

                    const sepIndex = param.indexOf('=');

                    const key = param.slice(0, sepIndex);
                    const val = param.slice(sepIndex + 1, param.length);

                    queryParamsObject[key] = val;
                }
            }

            return page.Render(queryParamsObject);
        }
    }

    return <h1>ERROR 404</h1>;
}

export default App;
