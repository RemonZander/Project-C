import { AppBar, createTheme, ThemeProvider, Toolbar } from '@material-ui/core';
import '@fontsource/raleway';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';

const theme = createTheme({
    typography: {
        fontFamily: 'Raleway, Arial',
    },
});

ReactDOM.render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <AppBar position="static">
                <Toolbar></Toolbar>
            </AppBar>
            <App />
        </ThemeProvider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
